import { Dispatch, SetStateAction } from "react";
import { AnyOrder } from "@/app/(site)/models";
import fetchRequest from "../../util/functions/fetchRequest";
import { ProductInOrder } from "@/app/(site)/models";
import { useWasabiContext } from "../../context/WasabiContext";
import createDummyProduct from "../../util/functions/createDummyProduct";
import { getProductPrice } from "../../util/functions/getProductPrice";
import calculateOrderTotal from "../../util/functions/calculateOrderTotal";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export function useOrderManager(orderId: number, setOrder: Dispatch<SetStateAction<AnyOrder>>) {
  const { updateGlobalState, fetchRemainingRice } = useWasabiContext();

  const updateOrder = (newOrder: RecursivePartial<AnyOrder>) =>
    setOrder((prevOrder) => {
      const products = [
        ...(newOrder.products || prevOrder.products).filter((p: any) => p.id !== -1),
        createDummyProduct(),
      ];

      const is_receipt_printed =
        newOrder.is_receipt_printed == undefined
          ? prevOrder.is_receipt_printed
          : newOrder.is_receipt_printed;

      const updatedOrder = {
        ...prevOrder,
        ...newOrder,
        products,
        is_receipt_printed,
      } as AnyOrder;

      updateGlobalState(updatedOrder, updatedOrder.state == "PAID" ? "delete" : "update");
      return updatedOrder;
    });

  const cancelOrder = (cooked: boolean = false) =>
    fetchRequest<AnyOrder>("POST", "/api/orders/", "cancelOrder", {
      orderId,
      cooked,
    }).then((deletedOrder) => {
      fetchRemainingRice();
      updateGlobalState(deletedOrder, "delete");
    });

  const createSubOrder = (parentOrder: AnyOrder, products: ProductInOrder[]) =>
    fetchRequest<AnyOrder>("POST", "/api/orders/", "createSubOrder", {
      parentOrder: { ...parentOrder },
      products,
    }).then((newSubOrder) => {
      const updatedProducts = parentOrder.products
        .map((product) => {
          const productToPay = products.find((p) => p.id === product.id);

          if (productToPay) {
            const paidQuantity = productToPay.quantity;
            const remainingQuantity = product.quantity - paidQuantity;

            const newTotal = remainingQuantity * getProductPrice(product, parentOrder.type);
            const newRiceQuantity = remainingQuantity * product.product.rice;

            const isPaidFully = paidQuantity >= product.quantity;

            return {
              ...product,
              quantity: remainingQuantity,
              paid_quantity: paidQuantity,
              total: newTotal,
              rice_quantity: newRiceQuantity,
              is_paid_fully: isPaidFully,
            };
          }

          return product;
        })
        .filter(Boolean) as ProductInOrder[];

      const updatedTotal = calculateOrderTotal(parentOrder);

      updateOrder({
        products: updatedProducts,
        total: updatedTotal,
        is_receipt_printed: false,
      });

      updateGlobalState(newSubOrder, "add");
    });

  return { updateOrder, cancelOrder, createSubOrder };
}
