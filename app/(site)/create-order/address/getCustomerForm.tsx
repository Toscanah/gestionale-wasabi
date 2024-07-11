import { zodResolver } from "@hookform/resolvers/zod";
import { Address, Customer } from "@prisma/client";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

const requiredField = z
  .string({ required_error: "Questo campo è richiesto" })
  .min(1, { message: "Questo campo è richiesto" });
const optionalField = z.string().optional();

const formSchema = z.object({
  street: requiredField,
  civic: requiredField,
  cap: optionalField,
  name: requiredField,
  surname: requiredField,
  floor: requiredField,
  stair: optionalField,
  street_info: optionalField,
  notes: optionalField,
  contact_phone: optionalField,
});

export type FormValues = z.infer<typeof formSchema>;

export default function getCustomerForm(
  address: Address | undefined,
  customer: Customer | undefined
) {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: address?.street,
      civic: address?.civic,
      cap: address?.cap?.toString() ?? undefined,
      name: customer?.name ?? undefined,
      surname: customer?.surname ?? undefined,
      floor: address?.floor ?? undefined,
      stair: address?.stair ?? undefined,
      street_info: address?.street_info ?? undefined,
      notes: "",
      contact_phone: "",
    },
  });
}
