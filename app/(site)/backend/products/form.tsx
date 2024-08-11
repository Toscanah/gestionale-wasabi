import { z } from "zod";
import getZodField from "../../util/functions/getZodField";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldType } from "../FormFields";
import { ControllerRenderProps } from "react-hook-form";
import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import SelectWrapper from "../../components/select/SelectWrapper";

export const formSchema = z.object({
  code: getZodField("string"),
  desc: getZodField("string"),
  site_price: getZodField("number"),
  home_price: getZodField("number"),
  rice: getZodField("number"),
  category: getZodField("any"),
});

export function getFormFields(
  categories: CategoryWithOptions[],
  defaultCategoryId: number
): FormFieldType[] {
  return [
    {
      name: "code",
      label: "Codice",
    },
    { name: "rice", label: "Riso", type: "number" },
    {
      name: "desc",
      label: "Descrizione",
      children: <Textarea className="resize-none" />,
    },
    {
      name: "site_price",
      label: "Prezzo in loco",
      type: "number",
    },
    {
      name: "home_price",
      label: "Prezzo asporto",
      type: "number",
    },
    {
      name: "category",
      label: "Categoria",
      children: ({ field }: { field: ControllerRenderProps }) => (
        <SelectWrapper
          className="h-10"
          field={field}
          groups={[
            {
              items: categories.map((cat) => ({
                value: cat.id.toString(),
                name: cat.category,
              })),
            },
          ]}
          defaultValue={defaultCategoryId.toString()}
        />
      ),
      unique: true,
    },
  ];
}
