import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { KitchenType as TypeOfKitchen } from "@prisma/client";
import { ControllerRenderProps } from "react-hook-form";

const kitchenTypeLabels: Record<TypeOfKitchen, string> = {
  [TypeOfKitchen.HOT]: "Cucina calda",
  [TypeOfKitchen.COLD]: "Cucina fredda",
  [TypeOfKitchen.HOT_AND_COLD]: "Cucina calda e fredda",
  [TypeOfKitchen.OTHER]: "Altro",
  [TypeOfKitchen.NONE]: "Nessuna",
};

export default function KitchenType({ field }: { field: ControllerRenderProps }) {
  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      className="w-full flex flex-wrap"
    >
      {Object.entries(kitchenTypeLabels).map(([value, label]) => (
        <div key={value} className="flex items-center space-x-2 w-[45%]">
          <RadioGroupItem value={value} id={value} />
          <Label htmlFor={value}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
