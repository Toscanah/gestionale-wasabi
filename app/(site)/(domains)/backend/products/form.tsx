import { z } from "zod";
import { FormFieldType } from "../manager/FormFields";
import { CategoryContracts, CategoryWithOptions } from "@/app/(site)/lib/shared";
import { KitchenTypeSchema } from "@/prisma/generated/schemas";
import KitchenType from "./KitchenType";
import WasabiSelect from "@/app/(site)/components/ui/wasabi/WasabiSelect";

export const productFormSchema = z.object({
  code: z
    .string({ error: "Il codice è obbligatorio" })
    .min(1, { error: "Il codice è obbligatorio" })
    .default(""),
  desc: z.string().min(1, { error: "La descrizione è obbligatoria" }).default(""),
  salads: z.coerce
    .number({ error: "Inserisci un numero" })
    .min(0, { error: "Le insalate devono essere un numero positivo" })
    .default(0),
  soups: z.coerce
    .number({ error: "Inserisci un numero" })
    .min(0, { error: "Le zuppe devono essere un numero positivo" })
    .default(0),
  rices: z.coerce
    .number({ error: "Inserisci un numero" })
    .min(0, { error: "Il riso extra deve essere un numero positivo" })
    .default(0),
  site_price: z.coerce
    .number({ error: "Inserisci un numero" })
    .gt(0, { error: "Il prezzo in loco deve essere maggiore di zero" })
    .default(0),
  home_price: z.coerce
    .number({ error: "Inserisci un numero" })
    .gt(0, { error: "Il prezzo asporto deve essere maggiore di zero" })
    .default(0),
  rice: z.coerce
    .number({ error: "Inserisci un numero" })
    .min(0, { error: "Il riso deve essere un numero positivo" })
    .default(0),
  category_id: z.coerce.number().nullable().default(null),
  kitchen: KitchenTypeSchema.default("NONE"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export function getProductFields(
  categories: CategoryContracts.GetAll.Output
): FormFieldType<z.input<typeof productFormSchema>>[] {
  return [
    {
      name: "code",
      label: "Codice",
    },
    {
      name: "rice",
      label: "Riso per cucinare (g)",
      type: "number",
    },
    {
      name: "salads",
      label: "Insalate",
      type: "number",
    },
    {
      name: "soups",
      label: "Zuppe",
      type: "number",
    },
    {
      name: "rices",
      label: "Riso extra",
      type: "number",
    },
    {
      name: "desc",
      label: "Descrizione",
    },
    {
      name: "site_price",
      label: "Prezzo in loco (€)",
      type: "number",
    },
    {
      name: "home_price",
      label: "Prezzo asporto (€)",
      type: "number",
    },
    {
      name: "category_id",
      label: "Categoria",
      description: (
        <span>
          Se hai bisogno di una nuova categoria vai a{" "}
          <a
            href="/backend/categories"
            className="underline text-primary hover:text-blue-500 transition-colors visited:text-primary"
          >
            questa pagina
          </a>
          .
        </span>
      ),
      render: (field) => (
        <WasabiSelect
          searchPlaceholder="Cerca categoria..."
          placeholder="Seleziona una categoria"
          triggerClassName="h-9"
          appearance="form"
          mode="single"
          onChange={(val: string) => {
            const parsed = val === "-1" ? null : Number(val);
            field.onChange(parsed);
          }}
          selectedValue={field.value?.toString() ?? "-1"}
          groups={[
            {
              options: [
                { value: "-1", label: "Nessuna categoria" },
                ...categories.map((cat) => ({
                  value: cat.id.toString(),
                  label: cat.category,
                })),
              ],
            },
          ]}
        />
      ),
    },
    {
      name: "kitchen",
      label: "Cucina",
      render: (field) => (
        <div className="space-y-2 text-center">
          <KitchenType field={field} />
        </div>
      ),
    },
  ];
}
