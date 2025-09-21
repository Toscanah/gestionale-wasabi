import { Button } from "@/components/ui/button";
import { useWasabiContext } from "../../../context/WasabiContext";
import OrderDeletionDialog from "../single-order/overview/OrderDeletionDialog";
import { ordersAPI } from "@/lib/server/api";

export default function DeleteOrdersBulk() {
  const { selectedOrders, updateGlobalState, toggleOrderSelection, updateRemainingRice } =
    useWasabiContext();

  const cancelInBulk = ordersAPI.cancelInBulk.useMutation({
    onSuccess: (deletedOrders) => {
      deletedOrders.forEach((o) => {
        toggleOrderSelection({ id: o.orderId, type: o.type });
        updateGlobalState({ id: o.orderId, type: o.type } as any, "delete");
      });
      updateRemainingRice();
    },
  });

  return (
    <OrderDeletionDialog
      type="bulk"
      onDelete={(productsCooked: boolean) =>
        cancelInBulk.mutate({
          orderIds: selectedOrders.map((o) => o.id),
          productsCooked,
        })
      }
      trigger={<Button variant="destructive">Elimina ordini selezionati</Button>}
    />
  );
}
