"use client";

import React, { forwardRef, ReactNode } from "react";
import { Control, ControllerRenderProps, FieldValues, Path, useController } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldRender } from "@/app/(site)/(domains)/backend/manager/FormFields";

export interface WasabiFieldProps<
  T extends FieldValues,
  TTransformedValues = T,
  K extends Path<T> = Path<T>,
> {
  control: Control<T, any, TTransformedValues>;
  name: K;
  label: string;
  description?: ReactNode;
  placeholder?: string;
  type?: string;
  className?: string;
  autoFocus?: boolean;
  render?: FieldRender<T, K>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * A typed, reusable form field using shadcn/ui's FormField primitives.
 */
function WasabiFieldInner<T extends FieldValues, TTransformedValues extends T = T>(
  {
    control,
    name,
    label,
    description,
    placeholder,
    render,
    type = "text",
    className,
    autoFocus = false,
    onKeyDown,
  }: WasabiFieldProps<T, TTransformedValues>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            {render ? (
              render(field, ref, onKeyDown)
            ) : (
              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                className={className}
                autoFocus={autoFocus}
                onKeyDown={onKeyDown}
                ref={ref}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const WasabiFormField = forwardRef(WasabiFieldInner) as <
  T extends FieldValues,
  TTransformedValues = T,
>(
  props: WasabiFieldProps<T, TTransformedValues> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof WasabiFieldInner>;
