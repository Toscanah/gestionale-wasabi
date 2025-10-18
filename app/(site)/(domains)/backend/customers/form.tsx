import { z } from "zod";
import { FormFieldType } from "../manager/FormFields";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps } from "react-hook-form";
import CustomerOriginSelection from "./CustomerOriginSelection";
import { CustomerOrigin } from "@prisma/client";

export const customerFormSchema = z.object({
  name: z.string().default(""),
  surname: z.string().default(""),
  phone: z
    .string({ error: "Il numero di telefono è obbligatorio" })
    .min(6, { error: "Il numero di telefono deve contenere almeno 6 caratteri" })
    .default(""),
  email: z.string().default(""),
  preferences: z.string().default(""),
  order_notes: z.string().default(""),
  origin: z.enum(CustomerOrigin).default(CustomerOrigin.UNKNOWN),
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
      render: (field) => <Textarea className="resize-none" {...field} />,
    },
    {
      name: "order_notes",
      label: "Note degli ordini",
      render: (field) => <Textarea className="resize-none" {...field} />,
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
    //   unique: true,
    //   children: ({ field }: { field: ControllerRenderProps }) => {
    //     return <CustomerAddresses field={field} />;
    //   },
    // },
  ];
}
