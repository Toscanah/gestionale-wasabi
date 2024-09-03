import React, {
  ReactNode,
  forwardRef,
  ComponentType,
  KeyboardEvent,
  ReactElement,
  RefObject,
} from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import {
  FormField as Field,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormFieldProps = {
  control: Control<any>;
  name: string;
  label: string;
  example?: string;
  children?:
    | ComponentType<{
        field: ControllerRenderProps;
        className?: string;
        onBlur?: () => void;
        onKeyDown: (e: React.KeyboardEvent) => void;
      }>
    | ReactElement;
  type?: string;
  handleKeyDown?: (e: KeyboardEvent) => void;
  className?: string;
  autofocus?: boolean;
};

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      control,
      name,
      label,
      example,
      children,
      handleKeyDown,
      className,
      type = "text",
      autofocus = false,
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
              {children ? (
                typeof children === "function" ? (
                  React.createElement(children, {
                    field,
                    className,
                    onBlur: () => {},
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (handleKeyDown) {
                        handleKeyDown(e);
                      }
                    },
                  })
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
                  autoFocus={autofocus}
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
        )}
      />
    );
  }
);

export default FormField;
