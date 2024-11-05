import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ControllerRenderProps } from "react-hook-form";

export default function KitchenType({ field }: { field: ControllerRenderProps }) {
  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      className="w-full flex justify-around"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="HOT" id="r1" />
        <Label htmlFor="r1">Cucina calda</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="COLD" id="r2" />
        <Label htmlFor="r2">Cucina fredda</Label>
      </div>
    </RadioGroup>
  );
}
