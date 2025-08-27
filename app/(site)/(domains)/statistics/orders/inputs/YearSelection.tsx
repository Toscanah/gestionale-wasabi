import WasabiSingleSelect from "@/app/(site)/components/ui/select/WasabiSingleSelect";
import { SelectionProps, WeekdaysSelection } from "../Section";

export default function YearSelection({ selection, dispatch }: SelectionProps<WeekdaysSelection>) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2025 - currentYear + 1 }, (_, i) => ({
    value: (2025 - i).toString(),
    name: (2025 - i).toString(),
  }));

  return (
    <WasabiSingleSelect
      className="h-10"
      groups={[{ items: years }]}
      value={selection.type == "year" ? selection.year : undefined}
      placeholder="Seleziona un'anno"
      onValueChange={(newYear) =>
        dispatch({
          type: "SET_WEEKDAYS_SELECTION",
          payload: { year: newYear },
        })
      }
    />
  );
}
