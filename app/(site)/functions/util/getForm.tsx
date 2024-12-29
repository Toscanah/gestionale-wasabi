import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
import { z } from "zod";

export default function getForm<T>(
  formSchema: z.ZodType<Partial<T>>,
  defaultValues?: DefaultValues<Partial<T>>
) {
  return useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
}
