import { KITCHEN_TYPE_LABELS } from "@/app/(site)/lib/shared/constants/kitchen-type-labels";
import { ControllerRenderProps } from "react-hook-form";
import WasabiSelect from "@/app/(site)/components/ui/wasabi/WasabiSelect";

export default function KitchenType({ field }: { field: ControllerRenderProps<any> }) {
  const options = Object.entries(KITCHEN_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="space-y-2 space-x-2 text-center">
      <WasabiSelect
        appearance="form"
        searchPlaceholder="Cerca cucina..."
        placeholder="Seleziona una cucina"
        triggerClassName="h-9"
        mode="single"
        selectedValue={field.value ?? "-1"}
        onChange={(val: string) => {
          const parsed = val === "-1" ? null : val;
          field.onChange(parsed);
        }}
        // field={{
        //   ...field,
        //   value: field.value?.toString() ?? "-1",
        //   onChange: ,
        // }}
        groups={[{ options }]}
      />
    </div>
  );
}
