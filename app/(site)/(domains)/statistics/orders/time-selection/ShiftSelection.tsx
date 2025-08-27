import WasabiSingleSelect from "@/app/(site)/components/ui/select/WasabiSingleSelect";
import { SelectionProps, Time, Shift } from "../Section";
import SelectFilter from "@/app/(site)/components/ui/filters/SelectFilter";

export default function ShiftSelection({ selection, dispatch }: SelectionProps<Time>) {
  return (
    <SelectFilter
      mode="single"
      title="Turno"
      selectedValue={selection.type == "shift" ? selection.shift : null}
      onChange={(newShift) => dispatch({ type: "SET_TIME", payload: { shift: newShift as Shift } })}
      groups={[
        {
          options: [
            { label: "Pranzo + cena", value: "all" },
            { label: "Pranzo", value: "lunch" },
            { label: "Cena", value: "dinner" },
          ],
        },
      ]}
    />
  );
}
