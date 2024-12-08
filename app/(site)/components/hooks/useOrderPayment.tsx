import { Dispatch, SetStateAction, useEffect, useState } from "react";
import applyDiscount from "../../util/functions/applyDiscount";
import { AnyOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { OrderType } from "@prisma/client";
import { useWasabiContext } from "../../context/WasabiContext";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { getProductPrice } from "../../util/functions/getProductPrice";
import { PaymentType } from "@prisma/client";
import createDummyProduct from "../../util/functions/createDummyProduct";
import { Payment } from "../../context/OrderPaymentContext";
import { useOrderContext } from "../../context/OrderContext";

export default function useOrderPayment(
  order: AnyOrder,
  type: "full" | "partial",
  onOrderPaid: () => void,
  payment: Payment,
  setPayment: Dispatch<SetStateAction<Payment>>
) {
  const { updateGlobalState } = useWasabiContext();
  const { setProducts } = useOrderContext();

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

      if (type === "partial") {
        setProducts((prevProducts) => {
          const productsToPayMap = new Map(
            productsToPay.map((product) => [product.id, product.quantity])
          );

          const newProducts = prevProducts
            .map((product) => {
              const paid_quantity = productsToPayMap.get(product.id) || 0;
              const remainingQuantity = product.quantity - paid_quantity;

              if (remainingQuantity <= 0) return null;

              const newPaidQuantity = product.paid_quantity + paid_quantity;
              const newTotal =
                remainingQuantity * getProductPrice(product, order.type as OrderType);

              return {
                ...product,
                quantity: remainingQuantity,
                paid_quantity: newPaidQuantity,
                total: newTotal,
                is_paid_fully: newPaidQuantity >= product.quantity,
              };
            })
            .filter(Boolean);

          newProducts.push(createDummyProduct());
          return newProducts as ProductInOrderType[];
        });
      }

      updateGlobalState(updatedOrder, updatedOrder.state == "PAID" ? "delete" : "update");
    });
  };

  return { handlePaymentChange, payOrder };
}
