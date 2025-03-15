import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DAYS_OF_WEEK, SelectionProps } from "../Section";

export default function WeekdaysSelection({
  selection: weekdays,
  dispatch,
}: SelectionProps<DAYS_OF_WEEK[] | undefined>) {
  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      className="flex gap-4"
      value={weekdays}
      onValueChange={(newWeekdays: DAYS_OF_WEEK[]) =>
        dispatch({ type: "SET_WEEKDAYS", payload: newWeekdays })
      }
    >
      {Object.values(DAYS_OF_WEEK).map((day) => (
        <ToggleGroupItem value={day} key={day}>
          {day}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
