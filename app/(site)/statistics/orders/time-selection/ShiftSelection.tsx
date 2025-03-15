import SelectWrapper from "@/app/(site)/components/select/SelectWrapper";
import { SelectionProps, Shift } from "../Section";

export default function ShiftSelection({ selection: shift, dispatch }: SelectionProps<Shift>) {
  return (
    <SelectWrapper
      value={shift}
      onValueChange={(newShift) =>
        dispatch({ type: "SET_TIME", payload: { type: "shift", shift: newShift } })
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
