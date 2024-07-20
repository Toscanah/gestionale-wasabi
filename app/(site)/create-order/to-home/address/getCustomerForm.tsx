import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const requiredField = z
  .string({ required_error: "Questo campo è richiesto" })
  .min(1, { message: "Questo campo è richiesto" });
const optionalField = z.string().optional();

const formSchema = z.object({
  street: requiredField,
  civic: requiredField,
  cap: optionalField,
  doorbell: requiredField,
  name: requiredField,
  surname: requiredField,
  floor: requiredField,
  stair: optionalField,
  street_info: optionalField,
  notes: optionalField,
  contact_phone: optionalField,
  when: z.any({
    required_error: "Questo campo è richiesto",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export default function getCustomerForm() {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
}
