import {
  FormField as Field,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, {
  ReactNode,
  forwardRef,
  ComponentType,
  KeyboardEvent,
  ForwardedRef,
  ReactElement,
} from "react";
import { Control, ControllerRenderProps } from "react-hook-form";

type FormFieldProps = {
  control: Control<any>;
  name: string;
  label: string;
  example?: string;
  children?: ComponentType<{ field: ControllerRenderProps; className?: string }> | ReactElement;
  type?: string;
  handleKeyDown?: (e: KeyboardEvent) => void;
  className?: string;
};

const FormField = forwardRef<any, FormFieldProps>(
  ({ control, name, label, example, children, type = "text", handleKeyDown, className }, ref) => {
    return (
      <Field
        control={control}
        name={name}
        render={({ field }) => {
          return (
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
                {children ? (
                  typeof children === "function" ? (
                    React.createElement(children, { field, className })
                  ) : (
                    React.cloneElement(children as ReactElement, {
                      ...field,
                      ref,
                      onBlur: () => {},
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (handleKeyDown) {
                          handleKeyDown(e);
                        }
                      },
                    })
                  )
                ) : (
                  <Input
                    {...field}
                    onBlur={() => {}}
                    type={type}
                    ref={ref}
                    className={className}
                    onKeyDown={(e) => {
                      if (handleKeyDown) {
                        handleKeyDown(e);
                      }
                    }}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }
);

export default FormField;
