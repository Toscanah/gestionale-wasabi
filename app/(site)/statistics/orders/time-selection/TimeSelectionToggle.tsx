import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectionProps, Shift, Time } from "../Section";
import { Label } from "@/components/ui/label";

export default function TimeSelectionToggle({ selection, dispatch }: SelectionProps<Time>) {
  return (
    <RadioGroup
      value={selection.type}
      onValueChange={(value: "shift" | "range") =>
        dispatch({ type: "SET_TIME", payload: { type: value } })
      }
      className="flex gap-4"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="shift" id="shift" />
        <Label htmlFor="shift">Turno</Label>
      </div>
      
      <div className="flex items-center gap-2">
        <RadioGroupItem value="range" id="range" />
        <Label htmlFor="range">Intervallo orario</Label>
      </div>
    </RadioGroup>
  );
}
