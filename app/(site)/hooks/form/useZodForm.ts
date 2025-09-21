import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps } from "react-hook-form";
import z from "zod";

export default function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: UseFormProps<z.infer<TSchema>>
) {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema),
  });
}
