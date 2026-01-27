import { useZodForm } from "@/hooks/useZodForm";
import { CreatePromotionFormSchema } from "../CreatePromotionForm";
import { useEffect, useRef } from "react";
import { WasabiFormField } from "@/components/shared/wasabi/WasabiFormField";
import {
  FormControl,
  FormItem,
  FormMessage,
  FormField as RawFormField,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import WasabiDatePicker from "@/components/shared/wasabi/WasabiDatePicker";

interface CommonFieldsProps {
  form: ReturnType<typeof useZodForm<typeof CreatePromotionFormSchema>>;
}

export default function CommonFields({ form }: CommonFieldsProps) {
  const { control } = form;
  const never_expires = form.watch("never_expires");
  const expires_at = form.watch("expires_at");

  const lastExpiryRef = useRef<Date | undefined>(expires_at ?? undefined);

  useEffect(() => {
    if (expires_at instanceof Date) {
      lastExpiryRef.current = expires_at;
    }
  }, [expires_at]);

  useEffect(() => {
    if (never_expires) {
      form.setValue("expires_at", undefined);
    } else {
      if (!form.getValues("expires_at")) {
        form.setValue("expires_at", lastExpiryRef.current ?? new Date());
      }
    }
  }, [never_expires, form]);

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      <div className="flex w-full gap-4 items-center">
        <WasabiFormField className="flex-1" control={control} label="Etichetta" name="label" />
        <WasabiFormField className="flex-1" control={control} label="Codice" name="code" />
      </div>

      <div className="flex gap-2 self-start">
        <WasabiFormField
          control={control}
          name="never_expires"
          render={(field) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={!(field.value as boolean)}
                  onCheckedChange={() => field.onChange(!field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Label>Scade?</Label>
      </div>

      <WasabiFormField
        control={control}
        label="Data di scadenza"
        name="expires_at"
        render={(field) => (
          <WasabiDatePicker
            disabled={never_expires}
            appearance="form"
            mode="single"
            onChange={(newDate) => field.onChange(newDate as Date)}
            value={field.value as Date}
          />
        )}
      />
    </div>
  );
}
