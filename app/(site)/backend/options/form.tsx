import { z } from "zod";
import getZodField from "../../lib/util/getZodField";
import { FormFieldType } from "../FormFields";

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
