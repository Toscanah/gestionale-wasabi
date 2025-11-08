import { WasabiFormField } from "@/app/(site)/components/ui/wasabi/WasabiFormField";
import { PromotionFormProp } from "../CreatePromotionTab";
import {
  FormControl,
  FormItem,
  FormMessage,
  FormField as RawFormField,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

export interface SpecificFieldsProps {
  form: PromotionFormProp;
}

export function FixedDiscountFields({ form }: SpecificFieldsProps) {
  return (
    <WasabiFormField control={form.control} type="number" name="fixed_amount" label="Importo (€)" />
  );
}

export function PercentageDiscountFields({ form }: SpecificFieldsProps) {
  const reusable = form.watch("reusable");

  useEffect(() => {
    if (reusable === false) {
      form.setValue("max_usages", null);
    }
  }, [reusable, form]);

  return (
    <>
      <WasabiFormField control={form.control} name="percentage_value" label="Percentuale (%)" />

      <div className="flex gap-2 self-start ">
        <RawFormField
          control={form.control}
          name="reusable"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox checked={field.value ? true : false} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Label>Usabile più volte?</Label>
      </div>

      <WasabiFormField
        disabled={!reusable!}
        control={form.control}
        name="max_usages"
        label="Utilizzi massimi"
      />
    </>
  );
}

export function GiftCardFields({ form }: SpecificFieldsProps) {
  return <WasabiFormField control={form.control} name="fixed_amount" label="Importo (€)" />;
}
