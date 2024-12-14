import { Dispatch, SetStateAction, useEffect } from "react";
import applyDiscount from "../../util/functions/applyDiscount";
import { AnyOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { OrderType } from "@prisma/client";
import { useWasabiContext } from "../../context/WasabiContext";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { getProductPrice } from "../../util/functions/getProductPrice";
import { PaymentType } from "@prisma/client";
import { Payment } from "../../context/OrderPaymentContext";
import { useOrderContext } from "../../context/OrderContext";
import calculateOrderTotal from "../../util/functions/calculateOrderTotal";

export default function useOrderPayment(
  type: "full" | "partial",
  onOrderPaid: () => void,
  payment: Payment,
  setPayment: Dispatch<SetStateAction<Payment>>,
  order: AnyOrder
) {
  const { updateOrder } = useOrderContext();

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
        type: type.toUpperCase(),
        order_id: order.id,
      }));

    fetchRequest<AnyOrder>("POST", "/api/payments/", "payOrder", {
      payments,
      productsToPay,
    }).then((updatedOrder) => {
      onOrderPaid();

      if (type == "full") return updateOrder({ state: updatedOrder.state });

      const updatedProducts = productsToPay
        .map((product) => {
          const paid_quantity = product.paid_quantity || 0;
          const remainingQuantity = product.quantity - paid_quantity;

          if (remainingQuantity <= 0) return null;

          const newPaidQuantity = paid_quantity + product.paid_quantity;
          const newTotal = remainingQuantity * getProductPrice(product, order.type as OrderType);

          return {
            ...product,
            quantity: remainingQuantity,
            paid_quantity: newPaidQuantity,
            total: newTotal,
            rice_quantity: remainingQuantity * product.product.rice,
            is_paid_fully: newPaidQuantity >= product.quantity,
          };
        })
        .filter(Boolean) as ProductInOrderType[];

      const updatedTotal = calculateOrderTotal({ ...updatedOrder, products: updatedProducts });

      updateOrder({
        state: updatedOrder.state,
        products: updatedProducts,
        total: updatedTotal,
      });
    });
  };

  return { handlePaymentChange, payOrder };
}
