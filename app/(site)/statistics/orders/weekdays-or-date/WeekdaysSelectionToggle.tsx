import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DAYS_OF_WEEK, SelectionProps } from "../Section";

export default function WeekdaysSelectionToggle<T extends any[] | undefined>({
  selection: weekdays,
  dispatch,
}: SelectionProps<DAYS_OF_WEEK[] | undefined>) {
  return (
    <ToggleGroup
      type="multiple"
      variant="outline"
      className="w-1/2 flex gap-4"
      value={weekdays}
      onValueChange={(newWeekdays) => dispatch({ type: "SET_WEEKDAYS", payload: newWeekdays as T })}
    >
      {Object.values(DAYS_OF_WEEK).map((day) => (
        <ToggleGroupItem value={day} key={day} className="flex-1">
          {day}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
