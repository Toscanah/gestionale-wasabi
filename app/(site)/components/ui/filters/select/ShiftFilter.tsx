import WasabiSelect from "./WasabiSelect";
import { OrderFilters } from "@/app/(site)/hooks/statistics/sectionReducer";
import { SHIFT_LABELS, ShiftFilterValue } from "@/app/(site)/lib/shared";
import { ForkKnife } from "@phosphor-icons/react";

interface ShiftFilterProps {
  selectedShift: ShiftFilterValue;
  onShiftChange: (updatedShift: ShiftFilterValue) => void;
  disabled?: boolean;
}

export default function ShiftFilter({ selectedShift, onShiftChange, disabled }: ShiftFilterProps) {
  return (
    <WasabiSelect
      mode="single"
      title="Turno"
      disabled={disabled}
      triggerIcon={ForkKnife}
      shouldClear={selectedShift !== ShiftFilterValue.ALL}
      selectedValue={selectedShift}
      onChange={(updatedShift) =>
        onShiftChange(
          updatedShift == "" ? ShiftFilterValue.ALL : (updatedShift as ShiftFilterValue)
        )
      }
      groups={[
        {
          options: [
            { value: ShiftFilterValue.ALL, label: SHIFT_LABELS.ALL },
            { value: ShiftFilterValue.LUNCH, label: SHIFT_LABELS.LUNCH },
            { value: ShiftFilterValue.DINNER, label: SHIFT_LABELS.DINNER },
          ],
        },
      ]}
    />
  );
}
