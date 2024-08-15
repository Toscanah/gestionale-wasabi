import { z } from "zod";
import getZodField from "../../util/functions/getZodField";
import { FormFieldType } from "../FormFields";
import { ControllerRenderProps } from "react-hook-form";
import { Option } from "../../types/Option";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomerAddresses from "./addresses/CustomerAddresses";
import { Input } from "@/components/ui/input";
import { Address } from "@prisma/client";

export const formSchema = z.object({
  name: getZodField("string", false),
  surname: getZodField("string", false),
  phone: getZodField("string", false),
  email: getZodField("string", false),
  preferences: getZodField("string", false),
  addresses: z.any().optional(),
});

export function getCustomerFields(): FormFieldType[] {
  return [
    {
      name: "name",
      label: "Nome",
    },
    {
      name: "surname",
      label: "Cognome",
    },
    {
      name: "phone",
      label: "Nummero di telefono",
      type: "text",
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
    {
      name: "addresses",
      label: "Indirizzi",
      unique: true,
      children: ({ field }: { field: ControllerRenderProps }) => (
        <CustomerAddresses field={field} />
      ),
    },
  ];
}
