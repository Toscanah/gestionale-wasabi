import { z } from "zod";
import getZodField from "../../util/functions/getZodField";
import { FormFieldType } from "../FormFields";
import { ControllerRenderProps } from "react-hook-form";
import { Option } from "../../types/Option";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const formSchema = z.object({
  option_name: getZodField("string"),
});

export function getOptionFields(): FormFieldType[] {
  return [
    {
      name: "option_name",
      label: "Opzione",
    },
    
  ];
}
