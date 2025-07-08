import { Dispatch, SetStateAction, useEffect } from "react";
import { AnyOrder } from "@shared";
import fetchRequest from "../lib/api/fetchRequest";
import { PaymentScope, PaymentType } from "@prisma/client";
import { DEFAULT_PAYMENT, Payment } from "../context/OrderPaymentContext";
import { useOrderContext } from "../context/OrderContext";
import scaleProducts from "../lib/product-management/scaleProducts";
import { getOrderTotal } from "../lib/order-management/getOrderTotal";
import { OrderPaymentProps } from "../payments/order/OrderPayment";

interface UseOrderPaymentParams extends Omit<OrderPaymentProps, "onBackButton" | "partialOrder"> {
  payment: Payment;
  setPayment: Dispatch<SetStateAction<Payment>>;
  payingOrder: AnyOrder;
}

export default function useOrderPayment({
  stage,
  scope,
  onOrderPaid,
  payment,
  setPayment,
  payingOrder,
  manualTotalAmount,
}: UseOrderPaymentParams) {
  const { updateOrder, order: originalOrder } = useOrderContext();
  const { paymentAmounts } = payment;
  const orderTotal =
    manualTotalAmount ?? getOrderTotal({ order: payingOrder, applyDiscount: true });

  useEffect(() => {
    const totalPaid = Object.values(paymentAmounts).reduce((sum, amount) => sum + (amount ?? 0), 0);

    setPayment((prevPayment) => ({
      ...prevPayment,
      paidAmount: totalPaid,
      remainingAmount: orderTotal - totalPaid,
    }));
  }, [paymentAmounts, orderTotal]);

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
      ...DEFAULT_PAYMENT,
      remainingAmount: orderTotal,
    });

  const payOrder = () => {
    const productsToPay = payingOrder.products;

    const totalToPay = orderTotal;
    let remaining = totalToPay;

    const payments = Object.entries(payment.paymentAmounts)
      .filter(([_, amount]) => amount && amount > 0)
      .map(([type, amount]) => {
        const clipped = Math.min(amount!, remaining);
        remaining -= clipped;
        return {
          amount: clipped,
          type: type.toUpperCase() as PaymentType,
          order_id: payingOrder.id,
          scope,
        };
      });
    // .filter((p) => p.amount > 0);

    fetchRequest<AnyOrder>("POST", "/api/payments/", "payOrder", {
      payments,
      productsToPay,
    }).then((updatedOrder) => {
      onOrderPaid();

      if (stage == "FINAL") {
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
    });
  };

  return { handlePaymentChange, payOrder, resetPaymentValues };
}
