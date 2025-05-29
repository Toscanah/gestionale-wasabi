import { Dispatch, SetStateAction, useEffect, useState } from "react";
import getDiscountedTotal from "../lib/order-management/getDiscountedTotal";
import { AnyOrder } from "@shared";
import fetchRequest from "../lib/api/fetchRequest";
import { PaymentType } from "@prisma/client";
import { Payment } from "../context/OrderPaymentContext";
import { useOrderContext } from "../context/OrderContext";
import scaleProducts from "../lib/product-management/scaleProducts";
import { getOrderTotal } from "../lib/order-management/getOrderTotal";

export default function useOrderPayment(
  isPaying: boolean,
  setIsPaying: Dispatch<SetStateAction<boolean>>,
  type: "full" | "partial",
  onOrderPaid: () => void,
  payment: Payment,
  setPayment: Dispatch<SetStateAction<Payment>>,
  order: AnyOrder
) {
  const { updateOrder, order: originalOrder } = useOrderContext();

  useEffect(() => {
    const totalPaid = Object.values(payment.paymentAmounts).reduce(
      (sum, amount) => sum + (amount ?? 0),
      0
    );

    setPayment((prevPayment) => ({
      ...prevPayment,
      paidAmount: totalPaid,
      remainingAmount: getOrderTotal({ order, applyDiscount: true }) - totalPaid,
    }));
  }, [payment.paymentAmounts]);

  const handlePaymentChange = (type: PaymentType, value: number | undefined) =>
    setPayment((prevPayment) => ({
      ...prevPayment,
      paymentAmounts: {
        ...prevPayment.paymentAmounts,
        [type]:
          value === undefined || isNaN(value)
            ? prevPayment.paymentAmounts[type]
            : (prevPayment.paymentAmounts[type] || 0) + value,
      },
    }));

  const resetPaymentValues = () =>
    setPayment({
      paymentAmounts: {
        [PaymentType.CASH]: undefined,
        [PaymentType.CARD]: undefined,
        [PaymentType.VOUCH]: undefined,
        [PaymentType.CREDIT]: undefined,
      },
      paidAmount: 0,
      remainingAmount: getOrderTotal({ order, applyDiscount: true }),
    });

  const payOrder = () => {
    if (isPaying) return;

    setIsPaying(true);

    const productsToPay = order.products;
    const payments = Object.entries(payment.paymentAmounts)
      .filter(([_, amount]) => amount && amount > 0)
      .map(([type, amount]) => ({
        amount,
        type: type.toUpperCase() as PaymentType,
        order_id: order.id,
      }));

    fetchRequest<AnyOrder>("POST", "/api/payments/", "payOrder", {
      payments,
      productsToPay,
    })
      .then((updatedOrder) => {
        onOrderPaid();

        if (type == "full") {
          updateOrder({ state: "PAID" });
          return;
        }

        const { updatedProducts } = scaleProducts({
          originalProducts: originalOrder.products,
          productsToScale: productsToPay,
          orderType: originalOrder.type,
        });

        updateOrder({
          state: updatedOrder.state,
          products: updatedProducts,
        });
      })
      .finally(() => setIsPaying(false));
  };

  return { handlePaymentChange, payOrder, resetPaymentValues };
}
