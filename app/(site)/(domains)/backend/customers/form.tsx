import { z } from "zod";
import { FormFieldType } from "../manager/FormFields";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";
import CustomerOriginSelection from "./CustomerOriginSelection";

export const formSchema = z.object({
  // name: getZodField("string", false),
  // surname: getZodField("string", false),
  // phone: getZodField("string"),
  // email: getZodField("string", false),
  // preferences: getZodField("string", false),
  // order_notes: getZodField("string", false),
  // phone_id: getZodField("any", false),
  // active: getZodField("boolean", false),
  // origin: getZodField("string", false),
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
    {
      name: "order_notes",
      label: "Note degli ordini",
      children: <Textarea className="resize-none" />,
    },
    {
      name: "origin",
      label: "Origine",
      unique: true,
      children: ({ field }: { field: ControllerRenderProps }) => {
        return (
          <div className="space-y-2 text-center">
            <CustomerOriginSelection field={field} />
          </div>
        );
      },
    },
    // lasciare questo per ultimo
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
