import { z } from "zod";
import getZodField from "../../functions/util/getZodField";
import { FormFieldType } from "../FormFields";
import CategoryOptions from "./CategoryOptions";
import { ControllerRenderProps } from "react-hook-form";
import { Option } from "@/prisma/generated/zod";

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
