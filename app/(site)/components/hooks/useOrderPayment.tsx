import { Dispatch, SetStateAction, useEffect } from "react";
import applyDiscount from "../../util/functions/applyDiscount";
import { AnyOrder } from "@/app/(site)/models";
import fetchRequest from "../../util/functions/fetchRequest";
import { OrderType } from "@prisma/client";
import { ProductInOrder } from "@/app/(site)/models";
import { getProductPrice } from "../../util/functions/getProductPrice";
import { PaymentType } from "@prisma/client";
import { Payment } from "../../context/OrderPaymentContext";
import { useOrderContext } from "../../context/OrderContext";
import calculateOrderTotal from "../../util/functions/calculateOrderTotal";
import { scaleProducts } from "../../util/functions/scaleProducts";

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
        [type]: value === undefined || isNaN(value) ? undefined : value,
      },
    }));

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
        return updateOrder({ state: updatedOrder.state });
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

  return { handlePaymentChange, payOrder };
}
