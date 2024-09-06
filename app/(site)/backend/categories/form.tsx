import { z } from "zod";
import getZodField from "../../util/functions/getZodField";
import { FormFieldType } from "../FormFields";
import CategoryOptions from "./CategoryOptions";
import { ControllerRenderProps } from "react-hook-form";
import { Option } from "../../types/Option";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export const formSchema = z.object({
  category: getZodField("string"),
  options: z.array(z.any()).optional(),
});

export function getCategoryFields(options: Option[]): FormFieldType[] {
  return [
    {
      name: "category",
      label: "Nome",
    },
    {
      name: "options",
      label: "Opzioni",
      unique: true,
      children: ({ field }: { field: ControllerRenderProps }) => {
        return (
          <div className="space-y-2 text-center">
            <CategoryOptions field={field} options={options} />
          </div>
        );
      },
    },
  ];
}
