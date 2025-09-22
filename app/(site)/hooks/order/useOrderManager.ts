import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AnyOrder, TableOrder } from "@/app/(site)/lib/shared";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { useWasabiContext } from "../../context/WasabiContext";
import generateDummyProduct from "../../lib/services/product-management/generateDummyProduct";
import { toastError, toastSuccess } from "../../lib/utils/global/toast";
import { OrderStatus, OrderType } from "@prisma/client";
import { trpc, trpcClient } from "@/lib/server/client";
import scaleProducts from "../../lib/services/product-management/scaleProducts";

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> | null : T[P] | null;
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
        updatedOrder.status == OrderStatus.PAID || updatedOrder.status == OrderStatus.CANCELLED
          ? "delete"
          : "update"
      );

      return updatedOrder;
    });

  const printedFlagMutation = trpc.orders.updatePrintedFlag.useMutation({
    onSuccess: () => updateOrder({ is_receipt_printed: true }),
  });

  const updatePrintedFlag = () => printedFlagMutation.mutateAsync({ orderId });

  const cancelOrder = async (cooked = false) => {
    const deletedOrder = await trpcClient.orders.cancel.mutate({ orderId, cooked });
    updateRemainingRice();
    updateGlobalState(deletedOrder, "delete");
  };

  const createSubOrder = async (
    parentOrder: AnyOrder,
    products: ProductInOrder[],
    isReceiptPrinted: boolean
  ) => {
    const newSubOrder = await trpcClient.orders.createSub.mutate({
      parentOrder,
      products,
      isReceiptPrinted,
    });
    const { updatedProducts } = scaleProducts({
      originalProducts: parentOrder.products,
      productsToScale: products,
    });
    updateGlobalState(newSubOrder, "add");
    updateOrder({ products: updatedProducts, is_receipt_printed: false });
  };

  const joinTableOrders = async (tableToJoin: string) => {
    const result = await trpcClient.orders.joinTables.mutate({
      originalOrderId: orderId,
      tableToJoin,
    });
    if (!result)
      return toastError(
        "Tavolo da unire non trovato oppure più ordini con lo stesso tavolo trovati"
      );
    setJoinedTables((prev) => [...prev, result.joinedTable]);
    updateOrder(result.updatedOrder);
    toastSuccess("Tavoli uniti con successo");
  };

  const issueLedgers = async (order: AnyOrder) => {
    const redeemables = order.engagements?.filter((e) => e.enabled && e.template?.redeemable) ?? [];
    if (redeemables.length > 0 && order.type !== OrderType.TABLE) {
      await trpcClient.engagements.issueLedgers.mutate({ orderId });
    }
  };

  useEffect(() => {
    if (joinedTables.length > 0) {
      joinedTables.forEach((table) => updateGlobalState(table, "delete"));
      setJoinedTables([]);
    }
  }, [dialogOpen]);

  return {
    updateOrder,
    updatePrintedFlag,
    cancelOrder,
    createSubOrder,
    joinTableOrders,
    issueLedgers,
  };
}
