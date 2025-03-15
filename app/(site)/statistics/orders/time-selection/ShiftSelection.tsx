import SelectWrapper from "@/app/(site)/components/select/SelectWrapper";
import { SelectionProps, Time, Shift } from "../Section";

export default function ShiftSelection({ selection, dispatch }: SelectionProps<Time>) {
  return (
    <SelectWrapper
      className="h-10 w-40"
      value={selection.type == "shift" ? selection.shift : undefined}
      onValueChange={(newShift) =>
        dispatch({ type: "SET_TIME", payload: { shift: newShift as Shift } })
      }
      groups={[
        {
          items: [
            { name: "Pranzo + cena", value: "all" },
            { name: "Pranzo", value: "lunch" },
            { name: "Cena", value: "dinner" },
          ],
        },
      ]}
    />
  );
}
