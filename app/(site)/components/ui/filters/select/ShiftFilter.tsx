import { SHIFT_LABELS, ShiftFilterValue } from "@/app/(site)/lib/shared";
import { ForkKnife, ForkKnifeIcon } from "@phosphor-icons/react";
import WasabiSelect from "../../wasabi/WasabiSelect";

interface ShiftFilterProps {
  selectedShift: ShiftFilterValue;
  onShiftChange: (updatedShift: ShiftFilterValue) => void;
  disabled?: boolean;
}

export default function ShiftFilter({ selectedShift, onShiftChange, disabled }: ShiftFilterProps) {
  return (
    <WasabiSelect
      searchPlaceholder="Cerca turno"
      appearance="filter"
      mode="single"
      title="Turno"
      shouldSort={false}
      disabled={disabled}
      triggerIcon={ForkKnifeIcon}
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
