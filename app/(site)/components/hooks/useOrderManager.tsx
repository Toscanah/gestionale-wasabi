import { Dispatch, SetStateAction } from "react";
import { AnyOrder } from "@/app/(site)/models";
import fetchRequest from "../../util/functions/fetchRequest";
import { ProductInOrder } from "@/app/(site)/models";
import { useWasabiContext } from "../../context/WasabiContext";
import createDummyProduct from "../../util/functions/createDummyProduct";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export function useOrderManager(order: AnyOrder, setOrder: Dispatch<SetStateAction<AnyOrder>>) {
  const { updateGlobalState, fetchRemainingRice } = useWasabiContext();

  const updateOrder = (order: RecursivePartial<AnyOrder>) =>
    setOrder((prevOrder) => {
      const updatedOrder = {
        ...prevOrder,
        ...order,
        products: [
          ...(order.products || prevOrder.products).filter((p: any) => p.id !== -1),
          createDummyProduct(),
        ],
        is_receipt_printed: !order.products,
      } as AnyOrder;

      updateGlobalState(updatedOrder, "update");
      return updatedOrder;
    });

  const cancelOrder = (cooked: boolean = false) =>
    fetchRequest<AnyOrder>("POST", "/api/orders/", "cancelOrder", {
      orderId: order.id,
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
