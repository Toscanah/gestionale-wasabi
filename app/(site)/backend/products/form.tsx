import { z } from "zod";
import getZodField from "../../util/functions/getZodField";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldType } from "../FormFields";
import { ControllerRenderProps } from "react-hook-form";
import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import SelectWrapper from "../../components/select/SelectWrapper";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";

export const formSchema = z.object({
  code: getZodField("string"),
  desc: getZodField("string"),
  site_price: getZodField("string"),
  home_price: getZodField("string"),
  rice: getZodField("number", false),
  category_id: getZodField("any", false),
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
  ];
}
