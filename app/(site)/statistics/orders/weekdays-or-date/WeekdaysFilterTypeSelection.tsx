import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectionProps, WeekdaysSelection } from "../Section";
import { Label } from "@/components/ui/label";
import YearSelection from "../inputs/YearSelection";
import RangeSelection from "../inputs/RangeSelection";

export default function WeekdaysFilterTypeSelection({
  selection,
  dispatch,
}: SelectionProps<WeekdaysSelection | undefined>) {
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup
        value={selection?.type}
        onValueChange={(value: "year" | "range") =>
          dispatch({ type: "SET_WEEKDAYS_SELECTION", payload: { type: value } })
        }
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="range" id="range" />
          <Label htmlFor="range">Intervallo date</Label>
        </div>

        <div className="flex items-center gap-2">
          <RadioGroupItem value="year" id="year" />
          <Label htmlFor="year">Anno specifico</Label>
        </div>
      </RadioGroup>

      {selection?.type === "range" && <RangeSelection selection={selection} dispatch={dispatch} />}
      {selection?.type === "year" && <YearSelection selection={selection} dispatch={dispatch} />}
    </div>
  );
}
