import {
  FormField as Field,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cloneElement, ReactNode, forwardRef } from "react";
import { Control } from "react-hook-form";

type FormFieldProps = {
  control: Control<any>;
  name: string;
  label: string;
  children?: ReactNode;
  type?: string;
  handleKeyDown?: (e: React.KeyboardEvent) => void;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ control, name, label, children, type = "text", handleKeyDown }, ref) => {
    return (
      <Field
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {!children ? (
                <Input
                  {...field}
                  type={type}
                  ref={ref}
                  onKeyDown={(e: any) => {
                    if (handleKeyDown) {
                      handleKeyDown(e);
                    }
                  }}
                />
              ) : (
                cloneElement(children as React.ReactElement, {
                  ...field,
                  ref,
                  field,
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (handleKeyDown) {
                      handleKeyDown(e);
                    }
                  },
                })
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
);

export default FormField;
