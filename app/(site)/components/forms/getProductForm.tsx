import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import getZodField from "../../util/functions/getZodField";

const formSchema = z.object({
  code: getZodField("string"),
  desc: getZodField("string"),
  site_price: getZodField("number"),
  home_price: getZodField("number"),
  rice: getZodField("number"),
  category: getZodField("any"),
});

export type FormValues = z.infer<typeof formSchema>;

export default function getProductForm(defaultValues?: FormValues) {
  return useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
}
