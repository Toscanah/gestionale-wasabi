import { useOrderContext } from "@/app/(site)/context/OrderContext";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shift } from "@prisma/client";

export default function ShiftSelection() {
  const { order, updateOrder } = useOrderContext();

  const handleShiftChange = (shift: Shift) => {
    const newShift = shift === order.shift ? Shift.UNSPECIFIED : shift;

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
        order.shift == Shift.UNSPECIFIED
          ? undefined
          : order.shift == Shift.LUNCH
          ? Shift.LUNCH
          : Shift.DINNER
      }
    >
      <div className="flex gap-2 items-center">
        <RadioGroupItem value={Shift.LUNCH} onClick={() => handleShiftChange(Shift.LUNCH)} />
        <Label>Pranzo</Label>
      </div>

      <div className="flex gap-2 items-center">
        <RadioGroupItem value={Shift.DINNER} onClick={() => handleShiftChange(Shift.DINNER)} />
        <Label>Cena</Label>
      </div>
    </RadioGroup>
  );
}
