import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DAYS_OF_WEEK, SelectionProps } from "../Section";

export default function WeekdaysSelection({
  selection: weekdays,
  dispatch,
}: SelectionProps<DAYS_OF_WEEK[] | undefined>) {
  const allDaysSelected = weekdays?.length === Object.values(DAYS_OF_WEEK).length;

  const toggleWeekdays = () => {
    if (allDaysSelected) {
      dispatch({ type: "SET_WEEKDAYS", payload: [] });
    } else {
      dispatch({ type: "SET_WEEKDAYS", payload: Object.values(DAYS_OF_WEEK) });
    }
  };

  return (
    <>
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

      <span
        onClick={toggleWeekdays}
        className="hover:underline text-sm text-muted-foreground hover:cursor-pointer"
      >
        {allDaysSelected ? "(deseleziona tutti)" : "(seleziona tutti)"}
      </span>
    </>
  );
}
