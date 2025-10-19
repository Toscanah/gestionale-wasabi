import { z } from "zod";
import { FormFieldType } from "../manager/FormFields";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";
import CustomerOriginSelection from "./CustomerOriginSelection";
import { CustomerOrigin } from "@prisma/client";
import CustomerAddresses from "./addresses/CustomerAddresses";
import { AddressSchema } from "@/prisma/generated/schemas";

export const customerFormSchema = z.object({
  name: z.string().default("").optional(),
  surname: z.string().default("").optional(),
  phone: z
    .string({ error: "Il numero di telefono è obbligatorio" })
    .min(6, { error: "Il numero di telefono deve contenere almeno 6 caratteri" })
    .default(""),
  email: z.string().default("").optional(),
  preferences: z.string().default("").optional(),
  order_notes: z.string().default("").optional(),
  origin: z.enum(CustomerOrigin).default(CustomerOrigin.UNKNOWN),
  addresses: z.array(AddressSchema).default([]).optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;

export function getCustomerFields(): FormFieldType<z.input<typeof customerFormSchema>>[] {
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
      render: (field) => <Textarea className="resize-none" {...(field as any)} />,
    },
    {
      name: "order_notes",
      label: "Note degli ordini",
      render: (field) => <Textarea className="resize-none" {...(field as any)} />,
    },
    {
      name: "origin",
      label: "Origine",
      render: (field) => (
        // <div className="space-y-2 text-center">
        <CustomerOriginSelection field={field} />
        // </div>
      ),
    },
    // {
    //   name: "addresses",
    //   label: "Indirizzi",
    //   render: (field) => {
    //     return <CustomerAddresses field={field} />;
    //   },
    // },
  ];
}
