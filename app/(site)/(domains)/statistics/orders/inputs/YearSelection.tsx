import WasabiSingleSelect from "@/app/(site)/components/ui/select/WasabiSingleSelect";
import { SelectionProps, WeekdaysSelection } from "../Section";
import SelectFilter from "@/app/(site)/components/ui/filters/SelectFilter";

export default function YearSelection({ selection, dispatch }: SelectionProps<WeekdaysSelection>) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2025 - currentYear + 1 }, (_, i) => ({
    value: (2025 - i).toString(),
    label: (2025 - i).toString(),
  }));

  return (
    <SelectFilter
      mode="single"
      title="Anno"
      groups={[{ options: years }]}
      selectedValue={selection.type == "year" ? selection.year : null}
      onChange={(newYear) =>
        dispatch({
          type: "SET_WEEKDAYS_SELECTION",
          payload: { year: newYear ?? undefined },
        })
      }
    />
  );
}
