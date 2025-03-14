import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectionProps } from "../Section";
import { Label } from "@/components/ui/label";

export default function WeekdaysOrDateToggle<T extends string | undefined>({
  selection: choice,
  dispatch,
}: SelectionProps<T>) {
  return (
    <RadioGroup
      value={choice}
      onValueChange={(newChoice) => dispatch({ type: "SET_MAIN_CHOICE", payload: newChoice as T })}
      className="w-1/2 flex gap-4 items-center"
    >
      <div className="flex gap-2 items-center">
        <RadioGroupItem value="weekdays" id="weekdays" />
        <Label htmlFor="weekdays">Giorni della settimana</Label>
      </div>

      <div className="flex gap-2 items-center">
        <RadioGroupItem value="date" id="date" />
        <Label htmlFor="date">Data specifica</Label>
      </div>
    </RadioGroup>
  );
}
