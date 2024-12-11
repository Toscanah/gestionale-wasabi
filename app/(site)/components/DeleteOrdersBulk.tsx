import { Button } from "@/components/ui/button";
import { useWasabiContext } from "../context/WasabiContext";
import fetchRequest from "../util/functions/fetchRequest";
import DialogWrapper from "./dialog/DialogWrapper";
import OrderDeletionDialog from "./dialog/OrderDeletionDialog";
import { AnyOrder } from "../types/PrismaOrders";

export default function DeleteOrdersBulk() {
  const { selectedOrders, updateGlobalState, toggleOrderSelection, fetchRemainingRice } =
    useWasabiContext();

  const deleteOrders = () =>
    fetchRequest<AnyOrder[]>("DELETE", "/api/orders", "deleteOrdersInBulk", {
      ordersId: selectedOrders,
    }).then((deletedOrders) => {
      deletedOrders.map((o) => {
        toggleOrderSelection(o.id);
        updateGlobalState(o, "delete");
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
