import { z } from "zod";
import getZodField from "../../functions/util/getZodField";
import { FormFieldType } from "../FormFields";
import { Textarea } from "@/components/ui/textarea";


export const formSchema = z.object({
  name: getZodField("string", false),
  surname: getZodField("string", false),
  phone: getZodField("string"),
  email: getZodField("string", false),
  preferences: getZodField("string", false),
  phone_id: getZodField("any", false),
  active: getZodField("boolean", false)
});

export function getCustomerFields(): FormFieldType[] {
  return [
    {
      name: "phone",
      label: "Numero di telefono",
      type: "text",
    },
    {
      name: "name",
      label: "Nome",
    },
    {
      name: "surname",
      label: "Cognome",
    },
    {
      name: "email",
      label: "Email",
    },
    {
      name: "preferences",
      label: "Preferenze",
      children: <Textarea className="resize-none" />,
    },
    { name: "phone_id", label: "phone_id" },
  
    // {
    //   name: "addresses",
    //   label: "Indirizzi",
    //   unique: true,
    //   children: ({ field }: { field: ControllerRenderProps }) => {
    //     return <CustomerAddresses field={field} />;
    //   },
    // },
  ];
}
