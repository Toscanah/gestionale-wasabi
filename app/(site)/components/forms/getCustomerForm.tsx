import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import getZodField from "../../util/getZodField";

const formSchema = z.object({
  street: getZodField("string"),
  civic: getZodField("string"),
  doorbell: getZodField("string"),
  name: getZodField("string"),
  surname: getZodField("string"),
  floor: getZodField("string"),
  stair: getZodField("string", false),
  street_info: getZodField("string", false),
  notes: getZodField("string", false),
  contact_phone: getZodField("string", false),
  preferences: getZodField("string", false),
  when: getZodField("any"),
});

export type FormValues = z.infer<typeof formSchema>;

export default function getCustomerForm() {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      when: "immediate",
    },
  });
}
