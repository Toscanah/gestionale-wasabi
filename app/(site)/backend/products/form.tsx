import { z } from "zod";
import getZodField from "../../util/functions/getZodField";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldType } from "../FormFields";
import { ControllerRenderProps } from "react-hook-form";
import { CategoryWithOptions } from "@/app/(site)/models";
import SelectWrapper from "../../components/select/SelectWrapper";
import KitchenType from "./KitchenType";

export const formSchema = z.object({
  code: getZodField("string"),
  desc: getZodField("string"),
  site_price: getZodField("number"),
  home_price: getZodField("number"),
  rice: getZodField("number", false),
  category_id: getZodField("number", false),
  kitchen: getZodField("string"),
});

export function getProductFields(categories: CategoryWithOptions[]): FormFieldType[] {
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
      name: "category_id",
      label: "Categoria",
      children: ({ field }: { field: ControllerRenderProps }) => {
        return (
          <div className="space-y-2 space-x-2 text-center">
            <SelectWrapper
              className="h-10"
              field={field}
              groups={[
                {
                  items: [
                    { value: "-1", name: "Nessuna categoria" },
                    ...categories.map((cat) => ({
                      value: cat.id.toString(),
                      name: cat.category,
                    })),
                  ],
                },
              ]}
              //defaultValue={field.value?.toString() == undefined ? "-1" : field.value?.toString()}
              value={field.value?.toString() || "-1"}
            />
          </div>
        );
      },
      unique: true,
    },
    {
      name: "kitchen",
      label: "Cucina",
      unique: true,
      children: ({ field }: { field: ControllerRenderProps }) => {
        return (
          <div className="space-y-2 text-center">
            <KitchenType field={field} />
          </div>
        );
      },
    },
  ];
}
