import SelectWrapper from "@/app/(site)/components/select/SelectWrapper";
import { SelectionProps, WeekdaysSelection } from "../Section";

export default function YearSelection({ selection: year, dispatch }: SelectionProps<string>) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2025 - currentYear + 1 }, (_, i) => ({
    value: (2025 - i).toString(),
    name: (2025 - i).toString(),
  }));

  return (
    <SelectWrapper
      className="h-10"
      groups={[{ items: years }]}
      value={year}
      onValueChange={(newYear) =>
        dispatch({
          type: "SET_WEEKDAYS_SELECTION",
          payload: { type: "year", year: newYear } as WeekdaysSelection,
        })
      }
    />
  );
}
