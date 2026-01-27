"use client";

import React, { ReactNode } from "react";
import { z, ZodAny, ZodType } from "zod";
import {
  useForm,
  DefaultValues,
  FieldValues,
  Path,
  ControllerRenderProps,
  Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { WasabiFormField } from "@/components/shared/wasabi/WasabiFormField";
import { useZodForm } from "../../../../../hooks/useZodForm";

export interface FieldRender<T extends FieldValues, K extends Path<T>> {
  (
    field: ControllerRenderProps<T, K>,
    ref?: React.Ref<HTMLInputElement>,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  ): React.ReactElement;
}

export interface FormFieldType<T extends FieldValues, K extends Path<T> = Path<T>> {
  name: K;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  description?: ReactNode;
  placeholder?: string;
  render?: FieldRender<T, K>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

/** 👇 This is the key: a union over all K */
export type AnyFieldDef<T extends FieldValues> = {
  [K in Path<T>]: FormFieldType<T, K>;
}[Path<T>];

/**
 * @template TSchema - the Zod schema type (ZodObject)
 * Automatically infers input/output types from it.
 */
export interface FormFieldsProps<TSchema extends z.ZodObject<Record<string, ZodType>>> {
  formSchema: TSchema;
  defaultValues?: DefaultValues<z.input<TSchema>>;
  formFields: AnyFieldDef<z.input<TSchema>>[];
  layout: { legend?: string; fields: Path<z.input<TSchema>>[] }[];
  submitLabel: string;
  handleSubmit: (values: z.output<TSchema>) => void;
}

export function FormFields<TSchema extends z.ZodObject<Record<string, ZodType>>>({
  formSchema,
  defaultValues,
  formFields,
  layout,
  submitLabel,
  handleSubmit,
}: FormFieldsProps<TSchema>) {
  const form = useZodForm({
    schema: formSchema,
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full">
        {layout.map((group, i) => (
          <React.Fragment key={i}>
            {/* {group.legend && <h3 className="text-base font-semibold mb-2">{group.legend}</h3>} */}

            <div className="w-full flex gap-4">
              {group.fields.map((fieldName) => {
                const def = formFields.find((f) => f.name === fieldName);
                if (!def) return null;

                return (
                  <WasabiFormField
                    key={String(def.name)}
                    control={form.control}
                    onKeyDown={def.onKeyDown}
                    name={def.name}
                    label={def.label}
                    type={def.type}
                    description={def.description}
                    placeholder={def.placeholder}
                    className=""
                    render={def.render}
                  />
                );
              })}
            </div>
          </React.Fragment>
        ))}

        <DialogFooter>
          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
