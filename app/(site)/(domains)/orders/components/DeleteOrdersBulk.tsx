import { Button } from "@/components/ui/button";
import { useWasabiContext } from "../../../context/WasabiContext";
import fetchRequest from "../../../lib/api/fetchRequest";
import OrderDeletionDialog from "../single-order/overview/OrderDeletionDialog";
import { AnyOrder } from "@/app/(site)/lib/shared";
import { CancelOrdersInBulkResponse } from "../../../lib/db/orders/cancelOrdersInBulk";

export default function DeleteOrdersBulk() {
  const { selectedOrders, updateGlobalState, toggleOrderSelection, updateRemainingRice } =
    useWasabiContext();

  const deleteOrders = (productsCooked: boolean) =>
    fetchRequest<CancelOrdersInBulkResponse[]>("DELETE", "/api/orders", "cancelOrdersInBulk", {
      orderIds: selectedOrders.map((o) => o.id),
      productsCooked,
    }).then((deletedOrders) => {
      deletedOrders.map((o) => {
        toggleOrderSelection({ id: o.id, type: o.type });
        updateGlobalState({ ...o } as any, "delete");
      });
      updateRemainingRice();
    });

  return (
    <OrderDeletionDialog
      type="bulk"
      onDelete={deleteOrders}
      trigger={<Button variant={"destructive"}>Elimina ordini selezionati</Button>}
    />
  );
}
