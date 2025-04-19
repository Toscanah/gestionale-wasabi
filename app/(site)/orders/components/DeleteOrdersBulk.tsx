import { Button } from "@/components/ui/button";
import { useWasabiContext } from "../../context/WasabiContext";
import fetchRequest from "../../lib/api/fetchRequest";
import OrderDeletionDialog from "../single-order/overview/OrderDeletionDialog";
import { AnyOrder } from "@shared"
;

export default function DeleteOrdersBulk() {
  const { selectedOrders, updateGlobalState, toggleOrderSelection, fetchRemainingRice } =
    useWasabiContext();

  const deleteOrders = () =>
    fetchRequest<Pick<AnyOrder, "id" | "type">[]>("DELETE", "/api/orders", "deleteOrdersInBulk", {
      ordersId: selectedOrders,
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
