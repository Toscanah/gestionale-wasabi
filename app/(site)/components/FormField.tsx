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
  example?: string;
  children?: ReactNode;
  type?: string;
  handleKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      control,
      name,
      label,
      example,
      children,
      type = "text",
      handleKeyDown,
      className,
    },
    ref
  ) => {
    return (
      <Field
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>
              {label}
              {example && (
                <>
                  {" "}
                  <span className="text-muted-foreground">{example}</span>
                </>
              )}
            </FormLabel>
            <FormControl>
              {!children ? (
                <Input
                  {...field}
                  type={type}
                  ref={ref}
                  className={className || ""}
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
