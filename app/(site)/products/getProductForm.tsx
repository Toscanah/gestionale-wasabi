import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const requiredField = z
  .string({ required_error: "Questo campo è richiesto" })
  .min(1, { message: "Questo campo è richiesto" });
const optionalField = z.string().optional();

const formSchema = z.object({
  code: requiredField,
  name: requiredField,
  desc: requiredField,
  site_price: z.coerce.number({ required_error: "Questo campo è richiesto" }),
  home_price: z.coerce.number({ required_error: "Questo campo è richiesto" }),
  rice: z.coerce.number({ required_error: "Questo campo è richiesto" }),
  category: z.any({
    required_error: "Questo campo è richiesto",
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export default function getProductForm() {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
}
