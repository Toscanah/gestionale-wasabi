import { z } from "zod";
import getZodField from "../../util/functions/getZodField";
import { Textarea } from "@/components/ui/textarea";
import { FormFieldType } from "../FormFields";
import { ControllerRenderProps } from "react-hook-form";
import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import SelectWrapper from "../../components/select/SelectWrapper";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export const formSchema = z.object({
  code: getZodField("string"),
  desc: getZodField("string"),
  site_price: getZodField("number"),
  home_price: getZodField("number"),
  rice: getZodField("number", false),
  category: getZodField("any"),
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
      name: "category",
      label: "Categoria",
      children: ({ field }: { field: ControllerRenderProps }) => {
        let hoverCondition = false;

        if (field.value !== "undefined") {
          hoverCondition =
            categories.find((cat) => cat.id.toString() === field.value) == undefined ? true : false;
        }

        return (
          <div className="space-y-2 text-center">
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
              defaultValue={field.value.toString()}
              //placeholder={!activeCategory ? "Categorie inattiva" : undefined}
            />
            {hoverCondition && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="text-sm hover:underline hover:cursor-pointer text-red-500">
                    Metti il cursore qua
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  La categoria di questo prodotto non è attiva e non è presente nell'elenco. Se la
                  rimuovi dovrai andare a riattivarla per poi re-impostarla di nuovo qua
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        );
      },
      unique: true,
    },
  ];
}
