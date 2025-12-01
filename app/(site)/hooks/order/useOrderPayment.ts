import { Dispatch, SetStateAction, useEffect } from "react";
import { OrderByType } from "@/app/(site)/lib/shared";
import { OrderStatus, PaymentScope, PaymentType } from "@/prisma/generated/client/enums";
import { DEFAULT_PAYMENT, Payment } from "../../context/OrderPaymentContext";
import { useOrderContext } from "../../context/OrderContext";
import scaleProducts from "../../lib/services/product-management/scaleProducts";
import { getOrderTotal } from "../../lib/services/order-management/getOrderTotal";
import { OrderPaymentProps } from "../../(domains)/payments/order/OrderPayment";
import { trpc } from "@/lib/server/client";

interface UseOrderPaymentParams extends Omit<OrderPaymentProps, "onBackButton" | "partialOrder"> {
  payment: Payment;
  setPayment: Dispatch<SetStateAction<Payment>>;
  payingOrder: OrderByType;
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
    manualTotalAmount ?? getOrderTotal({ order: payingOrder, applyDiscounts: true });

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

  const payOrderMutation = trpc.payments.payOrder.useMutation({
    onSuccess: (updatedOrder) => {
      const isPromoPaid =
        updatedOrder.payments.length === 1 &&
        updatedOrder.payments[0].amount === 0 &&
        updatedOrder.payments[0].type === PaymentType.PROMOTION;

      onOrderPaid([...updatedOrder.payments]);

      if (isPromoPaid || stage === "FINAL") {
        updateOrder({ status: OrderStatus.PAID });
        return;
      }

      const { updatedProducts } = scaleProducts({
        originalProducts: originalOrder.products,
        productsToScale: payingOrder.products,
      });

      updateOrder({
        status: updatedOrder.status,
        products: updatedProducts,
      });
    },
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

    payOrderMutation.mutate({
      payments,
      productsToPay,
    });
  };

  return { handlePaymentChange, payOrder, resetPaymentValues };
}
