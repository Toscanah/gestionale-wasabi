import { Dispatch, SetStateAction } from "react";
import { AnyOrder } from "@/app/(site)/models";
import fetchRequest from "../../util/functions/fetchRequest";
import { ProductInOrder } from "@/app/(site)/models";
import { useWasabiContext } from "../../context/WasabiContext";
import createDummyProduct from "../../util/functions/createDummyProduct";

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
      parentOrder,
      products,
    }).then((newSubOrder) => updateGlobalState(newSubOrder, "add"));

  return { updateOrder, cancelOrder, createSubOrder };
}
