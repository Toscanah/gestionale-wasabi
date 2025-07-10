import { Button } from "@/components/ui/button";
import { useWasabiContext } from "../../context/WasabiContext";
import fetchRequest from "../../lib/core/fetchRequest";
import OrderDeletionDialog from "../single-order/overview/OrderDeletionDialog";
import { AnyOrder } from "@/app/(site)/lib/shared";
import { CancelOrdersInBulkResponse } from "../../lib/db/orders/cancelOrdersInBulk";

export default function DeleteOrdersBulk() {
  const { selectedOrders, updateGlobalState, toggleOrderSelection, fetchRemainingRice } =
    useWasabiContext();

  const deleteOrders = (productsCooked: boolean) =>
    fetchRequest<CancelOrdersInBulkResponse[]>("DELETE", "/api/orders", "cancelOrdersInBulk", {
      ordersId: selectedOrders,
      productsCooked,
    }).then((deletedOrders) => {
      deletedOrders.map((o) => {
        toggleOrderSelection(o.id);
        updateGlobalState({ ...o } as any, "delete");
      });
      fetchRemainingRice();
    });

  return (
    <OrderDeletionDialog
      type="bulk"
      onDelete={deleteOrders}
      trigger={<Button variant={"destructive"}>Elimina ordini selezionati</Button>}
    />
  );
}
