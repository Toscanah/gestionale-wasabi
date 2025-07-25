import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnyOrder, TableOrder } from "@/app/(site)/lib/shared";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { useWasabiContext } from "../../context/WasabiContext";
import generateDummyProduct from "../../lib/services/product-management/generateDummyProduct";
import fetchRequest from "../../lib/api/fetchRequest";
import scaleProducts from "../../lib/services/product-management/scaleProducts";
import { toastError, toastSuccess } from "../../lib/utils/toast";

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export function useOrderManager(
  orderId: number,
  setOrder: Dispatch<SetStateAction<AnyOrder>>,
  dialogOpen: boolean
) {
  const { updateGlobalState, updateRemainingRice } = useWasabiContext();
  const [joinedTables, setJoinedTables] = useState<TableOrder[]>([]);

  const updateOrder = (newOrder: RecursivePartial<AnyOrder>) =>
    setOrder((prevOrder) => {
      const products = [
        ...(newOrder.products || prevOrder.products).filter((p: any) => p.id !== -1),
        generateDummyProduct(),
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

      updateGlobalState(
        updatedOrder,
        updatedOrder.state == "PAID" || updatedOrder.state == "CANCELLED" ? "delete" : "update"
      );

      return updatedOrder;
    });

  const cancelOrder = async (cooked: boolean = false) =>
    fetchRequest<AnyOrder>("DELETE", "/api/orders/", "cancelOrder", {
      orderId,
      cooked,
    }).then((deletedOrder) => {
      updateRemainingRice();
      updateGlobalState(deletedOrder, "delete");
    });

  const createSubOrder = async (
    parentOrder: AnyOrder,
    products: ProductInOrder[],
    isReceiptPrinted: boolean
  ) =>
    fetchRequest<AnyOrder>("POST", "/api/orders/", "createSubOrder", {
      parentOrder: { ...parentOrder },
      products,
      isReceiptPrinted,
    }).then((newSubOrder) => {
      const { updatedProducts } = scaleProducts({
        originalProducts: parentOrder.products,
        productsToScale: products,
        orderType: parentOrder.type,
      });

      updateGlobalState(newSubOrder, "add");

      updateOrder({
        products: updatedProducts,
        is_receipt_printed: false,
      });
    });

  const joinTableOrders = (tableToJoin: string) =>
    fetchRequest<{ updatedOrder: TableOrder; joinedTable: TableOrder }>(
      "POST",
      "/api/orders/",
      "joinTableOrders",
      { originalOrderId: orderId, tableToJoin }
    ).then((result) => {
      if (!result) {
        return toastError(
          "Tavolo da unire non trovato oppure più ordini con lo stesso tavolo trovati"
        );
      }

      setJoinedTables((prev) => [...prev, result.joinedTable]);
      updateOrder({ ...result.updatedOrder });
      toastSuccess("Tavoli uniti con successo");
    });

  useEffect(() => {
    if (joinedTables.length > 0) {
      joinedTables.forEach((table) => updateGlobalState(table, "delete"));
      setJoinedTables([]);
    }
  }, [dialogOpen]);

  return { updateOrder, cancelOrder, createSubOrder, joinTableOrders };
}
