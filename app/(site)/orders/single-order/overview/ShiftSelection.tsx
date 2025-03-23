import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WorkingShift } from "@prisma/client";

export default function ShiftSelection() {
  const { order, updateOrder } = useOrderContext();

  const handleShiftChange = (shift: WorkingShift) => {
    const newShift = shift === order.shift ? WorkingShift.UNSPECIFIED : shift;

    fetchRequest("PATCH", "/api/orders/", "updateOrderShift", {
      orderId: order.id,
      shift: newShift,
    }).then(() => {
      updateOrder({ shift: newShift });
      toastSuccess("Turno aggiornato con successo");
    });
  };

  return (
    <RadioGroup
      className="w-full flex items-center justify-between"
      value={
        order.shift == WorkingShift.UNSPECIFIED
          ? undefined
          : order.shift == WorkingShift.LUNCH
          ? WorkingShift.LUNCH
          : WorkingShift.DINNER
      }
    >
      <div className="flex gap-2 items-center">
        <RadioGroupItem
          value={WorkingShift.LUNCH}
          onClick={() => handleShiftChange(WorkingShift.LUNCH)}
        />
        <Label>Pranzo</Label>
      </div>

      <div className="flex gap-2 items-center">
        <RadioGroupItem
          value={WorkingShift.DINNER}
          onClick={() => handleShiftChange(WorkingShift.DINNER)}
        />
        <Label>Cena</Label>
      </div>
    </RadioGroup>
  );
}
