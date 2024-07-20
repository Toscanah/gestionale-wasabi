import {
  FormField as Field,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cloneElement, ReactNode } from "react";
import { Control } from "react-hook-form";

type FormFieldProps = {
  control: Control<any>;
  name: string;
  label: string;
  children?: ReactNode;
  type?: string;
};

export default function FormField({
  control,
  name,
  label,
  children,
  type = "text",
}: FormFieldProps) {
  return (
    <Field
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {!children ? (
              <Input {...field} type={type} />
            ) : (
              cloneElement(children as React.ReactElement, { ...field, field })
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
