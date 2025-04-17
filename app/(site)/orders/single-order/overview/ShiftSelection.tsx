import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WorkingShift } from "@prisma/client";

export default function ShiftSelection() {
  return <></>
  
  const { order, updateOrder } = useOrderContext();

  const handleShiftChange = (shift: WorkingShift) => {
    let newShift = shift;
    if (!shift) {
      newShift = WorkingShift.UNSPECIFIED;
    }

    fetchRequest("PATCH", "/api/orders/", "updateOrderShift", {
      orderId: order.id,
      shift: newShift,
    }).then(() => {
      updateOrder({ shift: newShift });
      toastSuccess("Turno aggiornato con successo");
    });
  };

  return (
    <ToggleGroup
      type="single"
      variant={"outline"}
      value={order.shift}
      onValueChange={handleShiftChange}
      className="w-full flex gap-2 h-full"
    >
      <ToggleGroupItem value={WorkingShift.LUNCH} className="w-full h-full">
        Pranzo
      </ToggleGroupItem>
      <ToggleGroupItem value={WorkingShift.DINNER} className="w-full h-full">
        Cena
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
