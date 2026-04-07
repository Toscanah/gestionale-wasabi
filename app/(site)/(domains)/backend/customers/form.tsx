import { z } from "zod";
import { FormFieldType } from "../manager/FormFields";
import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps, useWatch } from "react-hook-form";
import CustomerOriginSelection from "./fields/CustomerOriginSelection";
import { CustomerOrigin } from "@/prisma/generated/client/enums";
import CustomerAddresses from "./fields/CustomerAddresses";
import { AddressSchema } from "@/prisma/generated/zod/schemas";
import PhoneChangeField from "./fields/PhoneChangeField";
import {
  CustomerDiscountSchema,
  CustomerDiscountType,
  CustomerDiscountTypeSchema,
  CustomerDiscountValueSchema,
} from "@/lib/shared";
import CustomerDiscountValue from "./fields/CustomerDiscountValue";
import WasabiSelect from "@/components/ui/shared/wasabi/WasabiSelect";
import { CUSTOMER_DISCOUNT_LABELS } from "@/lib/shared/constants/enum-labels/customer-discount";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";

export const customerFormSchema = z
  .object({
    name: z.string().default("").optional(),
    surname: z.string().default("").optional(),
    phone: z
      .string({ error: "Il numero di telefono è obbligatorio" })
      // .min(6, { error: "Il numero di telefono deve contenere almeno 6 caratteri" })
      .default(""),
    email: z.string().default("").optional(),
    preferences: z.string().default("").optional(),
    order_notes: z.string().default("").optional(),
    origin: z.enum(CustomerOrigin).default(CustomerOrigin.UNKNOWN),
    addresses: z.array(AddressSchema).default([]).optional(),
    fixed_discount_value: CustomerDiscountValueSchema.default(0),
    fixed_discount_type: CustomerDiscountTypeSchema.default("NONE"),
  })
  .superRefine((data, ctx) => {
    const { fixed_discount_type, fixed_discount_value } = data;

    // Rule 1: If Type is NONE, Value MUST be 0
    if (fixed_discount_type === "NONE" && fixed_discount_value !== 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lo sconto deve essere 0 se non è selezionato un tipo",
        path: ["fixed_discount_value"], // This attaches the error to the input!
      });
    }

    // Rule 2: If Type is PERCENTAGE, Value must be between 0 and 100
    if (
      fixed_discount_type === "PERCENTAGE" &&
      (fixed_discount_value < 0 || fixed_discount_value > 100)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La percentuale deve essere compresa tra 0 e 100",
        path: ["fixed_discount_value"],
      });
    }

    // Rule 3: If a type is selected (not NONE), value cannot be 0 (optional logic)
    if (fixed_discount_type !== "NONE" && fixed_discount_value <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Inserire un valore di sconto valido",
        path: ["fixed_discount_value"],
      });
    }
  });

export type CustomerFormData = z.infer<typeof customerFormSchema>;

export function getCustomerFields(): FormFieldType<z.input<typeof customerFormSchema>>[] {
  return [
    {
      name: "phone",
      label: "Numero di telefono",
      render: (field: ControllerRenderProps) => <PhoneChangeField field={field} />,
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
      render: (field) => <CustomerOriginSelection field={field} />,
    },
    {
      name: "fixed_discount_type",
      label: "Sconto fisso",
      render: (field) => (
        <WasabiSelect
          appearance="form"
          mode="single"
          onChange={field.onChange}
          selectedValue={field.value as any}
          groups={[
            {
              label: "Tipo di sconto",
              options: Object.entries(CUSTOMER_DISCOUNT_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            },
          ]}
        />
      ),
    },
    {
      name: "fixed_discount_value",
      label: "Valore dello sconto",
      render: (field, control) => <CustomerDiscountValue field={field} control={control as any} />,
    },
    {
      name: "addresses",
      label: "Indirizzi",
      render: (field) => {
        return <CustomerAddresses field={field} />;
      },
    },
  ];
}
