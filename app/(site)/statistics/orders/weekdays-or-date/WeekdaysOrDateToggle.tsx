import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectionProps, WeekdaysOrDateChoice } from "../Section";
import { Label } from "@/components/ui/label";

export default function WeekdaysOrDateToggle({
  selection: choice,
  dispatch,
}: SelectionProps<WeekdaysOrDateChoice>) {
  return (
    <RadioGroup
      value={choice}
      onValueChange={(newChoice) => dispatch({ type: "SET_MAIN_CHOICE", payload: newChoice })}
      className="flex gap-4 items-center justify-center"
    >
      <div className="flex gap-2 items-center w-auto">
        <RadioGroupItem value="weekdays" id="weekdays" />
        <Label htmlFor="weekdays">Giorni della settimana</Label>
      </div>

      <div className="flex gap-2 items-center w-auto">
        <RadioGroupItem value="date" id="date" />
        <Label htmlFor="date">Data specifica</Label>
      </div>
    </RadioGroup>
  );
}
