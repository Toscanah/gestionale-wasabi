"use client";

import { z } from "zod";
import getForm from "../util/functions/getForm";
import { ControllerRenderProps, DefaultValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import React, {
  ComponentType,
  HTMLInputTypeAttribute,
  ReactNode,
  ReactElement,
  RefObject,
  useRef,
} from "react";
import FormField from "../components/FormField";
import { useFocusCycle } from "../components/hooks/useFocusCycle";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type FormFieldType = {
  name: string;
  label: string;
  type?: HTMLInputTypeAttribute;
  children?: ComponentType<{ field: ControllerRenderProps }> | ReactElement;
  unique?: boolean;
  className?: string;
};

interface FormFieldsProps<T> {
  formSchema: z.ZodType<Partial<T>>;
  defaultValues?: DefaultValues<T>;
  formFields: FormFieldType[];
  handleSubmit: (values: Partial<T>) => void;
  footerName: string;
  layout: { fieldsPerRow: number }[];
}

export default function FormFields<T extends Partial<T>>({
  handleSubmit,
  footerName,
  formSchema,
  defaultValues,
  formFields,
  layout,
}: FormFieldsProps<T>) {
  const form = getForm<T>(formSchema, defaultValues);
  const onSubmit = (values: Partial<T>) => {
    handleSubmit(values);
  };

  let fieldIndex = 0;

  console.log("fields partito")

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {layout.map((row, rowIndex) => {
            const rowFields = formFields.slice(fieldIndex, fieldIndex + row.fieldsPerRow);
            fieldIndex += row.fieldsPerRow;

            return (
              <div key={rowIndex} className="flex gap-4">
                {rowFields.map((formField, index) => {
                  return !formField.children ? (
                    <FormField
                      key={formField.name}
                      control={form.control}
                      name={formField.name}
                      label={formField.label}
                      type={formField.type}
                      className={formField.className}
                    />
                  ) : formField.unique == true ? (
                    <FormField
                      key={formField.name}
                      control={form.control}
                      name={formField.name}
                      label={formField.label}
                      type={formField.type}
                      className={formField.className}
                    >
                      {({ field }) => {
                        return React.createElement(
                          formField.children as ComponentType<{
                            field: ControllerRenderProps;
                          }>,
                          { field }
                        );
                      }}
                    </FormField>
                  ) : (
                    <FormField
                      key={formField.name}
                      control={form.control}
                      name={formField.name}
                      label={formField.label}
                      type={formField.type}
                      className={formField.className}
                    >
                      {formField.children as ReactElement}
                    </FormField>
                  );
                })}
              </div>
            );
          })}

          <div className="flex w-full">
            <DialogFooter className="w-full">
              <Button type="submit" className="w-full">
                {footerName}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </div>
  );
}
