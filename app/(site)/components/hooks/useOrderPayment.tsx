import { Dispatch, SetStateAction, useEffect, useState } from "react";
import applyDiscount from "../../util/functions/applyDiscount";
import { AnyOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { OrderType } from "@prisma/client";
import { useWasabiContext } from "../../context/WasabiContext";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { getProductPrice } from "../../util/functions/getProductPrice";
import formatAmount from "../../util/functions/formatAmount";
import { PaymentType } from "@prisma/client";
import createDummyProduct from "../../util/functions/createDummyProduct";

export type Payment = {
  paymentAmounts: {
    [PaymentType.CASH]?: number;
    [PaymentType.CARD]?: number;
    [PaymentType.VOUCH]?: number;
    [PaymentType.CREDIT]?: number;
  };
  paidAmount: number;
  remainingAmount: number;
};

export default function useOrderPayment(
  order: AnyOrder,
  type: "full" | "partial",
  handleOrderPaid: () => void,
  setProducts?: Dispatch<SetStateAction<ProductInOrderType[]>>
) {
  const { onOrdersUpdate } = useWasabiContext();
  const [payment, setPayment] = useState<Payment>({
    paymentAmounts: {
      [PaymentType.CASH]: undefined,
      [PaymentType.CARD]: undefined,
      [PaymentType.VOUCH]: undefined,
      [PaymentType.CREDIT]: undefined,
    },
    paidAmount: 0,
    remainingAmount: applyDiscount(order.total, order.discount) ?? 0,
  });
  const [typedAmount, setTypedAmount] = useState<string>(formatAmount(payment.remainingAmount));

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

    fetchRequest("POST", "/api/payments/", "payOrder", {
      payments,
      productsToPay,
    }).then(() => {
      handleOrderPaid();

      if (type === "partial") {
        setProducts?.((prevProducts) => {
          const productsToPayMap = new Map(
            productsToPay.map((product) => [product.id, product.quantity])
          );

          const newProducts = prevProducts
            .map((product) => {
              const paidQuantity = productsToPayMap.get(product.id) || 0;
              const remainingQuantity = product.quantity - paidQuantity;

              if (remainingQuantity <= 0) return null;

              const newPaidQuantity = product.paidQuantity + paidQuantity;
              const newTotal =
                remainingQuantity * getProductPrice(product, order.type as OrderType);

              return {
                ...product,
                quantity: remainingQuantity,
                paidQuantity: newPaidQuantity,
                total: newTotal,
                isPaidFully: newPaidQuantity >= product.quantity,
              };
            })
            .filter(Boolean);

          newProducts.push(createDummyProduct());
          return newProducts as ProductInOrderType[];
        });
      }

      onOrdersUpdate(order.type as OrderType);
    });
  };

  return { handlePaymentChange, payment, payOrder, typedAmount, setTypedAmount };
}
