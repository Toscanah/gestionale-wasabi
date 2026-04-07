import { CUSTOMER_ORIGIN_LABELS } from "@/lib/shared";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ControllerRenderProps } from "react-hook-form";
import WasabiSelect from "@/components/ui/shared/wasabi/WasabiSelect";

export default function CustomerOriginSelection({ field }: { field: ControllerRenderProps }) {
  return (
    <WasabiSelect
      appearance="form"
      mode="single"
      onChange={field.onChange}
      selectedValue={field.value}
      groups={[
        {
          label: "Origine del cliente",
          options: Object.entries(CUSTOMER_ORIGIN_LABELS).map(([value, label]) => ({
            value,
            label,
          })),
        },
      ]}
    />
  );
}
