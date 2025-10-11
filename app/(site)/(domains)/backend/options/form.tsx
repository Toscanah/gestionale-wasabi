import { z } from "zod";
import { FormFieldType } from "../manager/FormFields";

export const optionFormSchema = z.object({
  option_name: z.string().min(1, "Il nome dell'opzione è obbligatorio").default(""),
});

export type OptionFormData = z.infer<typeof optionFormSchema>;

export function getOptionFields(): FormFieldType<z.input<typeof optionFormSchema>>[] {
  return [
    {
      name: "option_name",
      label: "Nome opzione",
    },
  ];
}
