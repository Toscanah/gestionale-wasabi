import { z } from "zod";
import { AnyFieldDef, FormFieldType } from "../manager/FormFields";
import CategoryOptions from "./CategoryOptions";
import { Option } from "@/prisma/generated/client/browser";
import { OptionSchema } from "@/prisma/generated/schemas";

export const categoryFormSchema = z.object({
  category: z.string().min(1, "Il nome è obbligatorio").default(""),
  options: z.array(OptionSchema).default([]),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export function getCategoryFields(
  options: Option[]
): AnyFieldDef<z.input<typeof categoryFormSchema>>[] {
  return [
    {
      name: "category",
      label: "Nome",
    },
    {
      name: "options",
      label: "Opzioni",
      description: (
        <span>
          Se hai bisogno di una nuova opzione vai a{" "}
          <a
            href="/backend/options"
            className="underline text-primary hover:text-blue-500 transition-colors visited:text-primary"
          >
            questa pagina
          </a>
          .
        </span>
      ),
      render: (field) => (
        <CategoryOptions
          allOptions={options}
          onChange={field.onChange}
          options={(field.value ?? []).map((opt) => ({
            ...opt,
            active: typeof opt.active === "boolean" ? opt.active : false,
          }))}
        />
      ),
    },
  ];
}
