import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectionProps } from "../Section";
import { Label } from "@/components/ui/label";

type SelectionWithType = {
  type: "range" | "year";
};

export default function WeekdaysFilterTypeSelection<T extends SelectionWithType | undefined>({
  selection,
  dispatch,
}: SelectionProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium">Select Weekdays Filter Type</label>

      <RadioGroup
        value={selection?.type}
        onValueChange={(value) =>
          dispatch({ type: "SET_WEEKDAYS_SELECTION", payload: { type: value } })
        }
        className="flex gap-4"
      >
        <div>
          <RadioGroupItem value="range" id="range" />
          <Label htmlFor="range">Intervallo</Label>
        </div>

        <div>
          <RadioGroupItem value="year" id="year" />
          <Label htmlFor="year">Anno specifico</Label>
        </div>
      </RadioGroup>

      {/* Holds responsibility for rendering filters */}
      {selection?.type === "range" && <RangeFilter state={selection} dispatch={dispatch} />}
      {selection?.type === "year" && <YearFilter state={selection} dispatch={dispatch} />}
    </div>
  );
}
