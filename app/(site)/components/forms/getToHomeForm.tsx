import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import getZodField from "../../util/functions/getZodField";

const formSchema = z.object({
  street: getZodField("string"),
  doorbell: getZodField("string"),
  name: getZodField("string", false),
  surname: getZodField("string", false),
  email: getZodField("string", false),
  floor: getZodField("string", false),
  stair: getZodField("string", false),
  street_info: getZodField("string", false),
  notes: getZodField("string", false),
  contact_phone: getZodField("string", false),
  preferences: getZodField("string", false),
  when: getZodField("any"),
});

export type FormValues = z.infer<typeof formSchema>;

export default function getToHomeForm() {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      when: "immediate",
    },
  });
}
