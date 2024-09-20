import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TYPE_OF_PAYMENT } from "../../payments/order/OrderPayment";
import applyDiscount from "../../util/functions/applyDiscount";
import { AnyOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { OrderType } from "../../types/OrderType";
import { useWasabiContext } from "../../context/WasabiContext";
import { ProductInOrderType } from "../../types/ProductInOrderType";

export type Payment = {
  paymentAmounts: {
    [TYPE_OF_PAYMENT.CASH]?: number;
    [TYPE_OF_PAYMENT.CARD]?: number;
    [TYPE_OF_PAYMENT.VOUCH]?: number;
    [TYPE_OF_PAYMENT.CREDIT]?: number;
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
      [TYPE_OF_PAYMENT.CASH]: undefined,
      [TYPE_OF_PAYMENT.CARD]: undefined,
      [TYPE_OF_PAYMENT.VOUCH]: undefined,
      [TYPE_OF_PAYMENT.CREDIT]: undefined,
    },
    paidAmount: 0,
    remainingAmount: applyDiscount(order.total, order.discount) ?? 0,
  });

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

  const handlePaymentChange = (type: TYPE_OF_PAYMENT, value: number | undefined) => {
    setPayment((prevPayment) => ({
      ...prevPayment,
      paymentAmounts: {
        ...prevPayment.paymentAmounts,
        [type]: value === undefined || isNaN(value) ? undefined : value,
      },
    }));
  };

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
      type,
      productsToPay,
    }).then(() => {
      onOrdersUpdate(order.type as OrderType);
      handleOrderPaid();

      if (type == "partial") {
        setProducts?.((prevProducts) => {
          const productsToPayMap = new Map(order.products.map((product) => [product.id, product]));

          const newProducts = prevProducts.map((product) => {
            const productToPay = productsToPayMap.get(product.id);

            if (productToPay) {
              const newQuantity = product.quantity - productToPay.quantity;
              const newPaidQuantity = product.paidQuantity + productToPay.quantity;
              const newTotal =
                newQuantity *
                (order.type === OrderType.TO_HOME
                  ? product.product.home_price
                  : product.product.site_price);

              return {
                ...product,
                quantity: newQuantity,
                paidQuantity: newPaidQuantity,
                total: newTotal,
                isPaidFully: newPaidQuantity >= product.quantity ? true : product.isPaidFully,
              };
            } else {
              return product;
            }
          });

          return newProducts;
        });
      }
    });
  };

  return { handlePaymentChange, payment, payOrder };
}
