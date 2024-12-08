import { Dispatch, SetStateAction } from "react";
import { AnyOrder } from "../../types/PrismaOrders";
import fetchRequest from "../../util/functions/fetchRequest";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { useWasabiContext } from "../../context/WasabiContext";
import createDummyProduct from "../../util/functions/createDummyProduct";

export function useOrderManager(order: AnyOrder, setOrder: Dispatch<SetStateAction<AnyOrder>>) {
  const { updateGlobalState, fetchRemainingRice } = useWasabiContext();

  const updateOrder = (updatedOrder: AnyOrder) => {
    setOrder({
      ...updatedOrder,
      products: [...updatedOrder.products.filter((p) => p.id !== -1), createDummyProduct()],
    });
    updateGlobalState(updatedOrder, "update");
  };

  const cancelOrder = (cooked: boolean = false) =>
    fetchRequest<AnyOrder>("POST", "/api/orders/", "cancelOrder", {
      orderId: order.id,
      cooked,
    }).then((deletedOrder) => {
      fetchRemainingRice();
      updateGlobalState(deletedOrder, "delete");
    });

  const createSubOrder = (parentOrder: AnyOrder, products: ProductInOrderType[]) =>
    fetchRequest<AnyOrder>("POST", "/api/orders/", "createSubOrder", {
      parentOrder,
      products,
    }).then((newSubOrder) => updateGlobalState(newSubOrder, "add"));

  return { updateOrder, cancelOrder, createSubOrder };
}
