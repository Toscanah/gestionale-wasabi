import { Dispatch, SetStateAction, useEffect } from "react";
import applyDiscount from "../functions/order-management/applyDiscount";
import { AnyOrder } from "@/app/(site)/models";
import fetchRequest from "../functions/api/fetchRequest";
import { PaymentType } from "@prisma/client";
import { Payment } from "../context/OrderPaymentContext";
import { useOrderContext } from "../context/OrderContext";
import scaleProducts from "../functions/product-management/scaleProducts";

export default function useOrderPayment(
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
      remainingAmount: (applyDiscount(order.total, order.discount) ?? 0) - totalPaid,
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
      remainingAmount: applyDiscount(order.total, order.discount) ?? 0,
    });

  const payOrder = () => {
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
    }).then((updatedOrder) => {
      onOrderPaid();

      if (type == "full") {
        updateOrder({ state: "PAID" });
        return;
      }

      const { updatedProducts, updatedTotal } = scaleProducts({
        originalProducts: originalOrder.products,
        productsToScale: productsToPay,
        orderType: originalOrder.type,
      });

      updateOrder({
        state: updatedOrder.state,
        products: updatedProducts,
        total: updatedTotal,
      });
    });
  };

  return { handlePaymentChange, payOrder, resetPaymentValues };
}
