import { Dispatch, SetStateAction } from "react";
import { AnyOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { OrderType } from "@prisma/client";
import { useWasabiContext } from "../../context/WasabiContext";
import { getProductPrice } from "../../util/functions/getProductPrice";

export function useOrderManager(
  order: AnyOrder,
  setOrder?: Dispatch<SetStateAction<AnyOrder | undefined>>
) {
  const { onOrdersUpdate, fetchRemainingRice } = useWasabiContext();

  const updateOrder = (updatedProducts: ProductInOrderType[]) => {
    onOrdersUpdate(order.type as OrderType);
    setOrder?.((prevOrder) => {
      if (!prevOrder) return prevOrder;

      return {
        ...prevOrder,
        products: updatedProducts,
        total: calculateTotal(updatedProducts),
      };
    });
  };

  const cancelOrder = (cooked: boolean = false) =>
    fetchRequest<AnyOrder>("POST", "/api/orders/", "cancelOrder", {
      orderId: order.id,
      cooked,
    }).then(() => {
      onOrdersUpdate(order.type as OrderType);
      fetchRemainingRice();
    });

  const createSubOrder = (parentOrder: AnyOrder, products: ProductInOrderType[]) =>
    fetchRequest("POST", "/api/orders/", "createSubOrder", {
      products,
      parentOrder,
    }).then(() => onOrdersUpdate(order.type as OrderType));

  const calculateTotal = (products: ProductInOrderType[]) =>
    products.reduce(
      (acc, product) => acc + product.quantity * getProductPrice(product, order.type as OrderType),
      0
    );

  return { updateOrder, cancelOrder, createSubOrder };
}
