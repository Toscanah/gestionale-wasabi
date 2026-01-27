import { CUSTOMER_ORIGIN_LABELS } from "@/lib/shared";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ControllerRenderProps } from "react-hook-form";

export default function CustomerOriginSelection({ field }: { field: ControllerRenderProps }) {
  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      className="w-full flex flex-wrap"
    >
      {Object.entries(CUSTOMER_ORIGIN_LABELS).map(([value, label]) => (
        <div key={value} className="flex items-center space-x-2 w-[45%]">
          <RadioGroupItem value={value} id={value} />
          <Label htmlFor={value}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
