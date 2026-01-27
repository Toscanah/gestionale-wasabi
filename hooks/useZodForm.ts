// useZodForm.ts
import { DefaultValues, useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";

export function useZodForm<TSchema extends z.ZodObject<Record<string, ZodType>>, TContext = any>(
  props: Omit<UseFormProps<z.input<TSchema>, TContext, z.output<TSchema>>, "resolver"> & {
    schema: TSchema;
    defaultValues?: DefaultValues<z.input<TSchema>>;
  }
): UseFormReturn<z.input<TSchema>, TContext, z.output<TSchema>> {
  const { schema, defaultValues, ...rest } = props;

  return useForm<z.input<TSchema>, TContext, z.output<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
    ...rest,
  });
}
