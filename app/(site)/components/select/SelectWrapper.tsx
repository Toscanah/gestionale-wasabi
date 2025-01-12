"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { forwardRef, KeyboardEvent } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface SelectWrapperProps {
  field?: ControllerRenderProps;
  defaultValue?: string;
  className?: string;
  groups: { label?: string; items: { value: string; name: string }[] | string[] }[];
  placeholder?: string;
  fixedValue?: boolean;
  value?: string;
  onKeyDown?: (e: KeyboardEvent<any>) => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const SelectWrapper = forwardRef<HTMLButtonElement, SelectWrapperProps>(
  (
    {
      field,
      defaultValue,
      className,
      groups,
      placeholder,
      fixedValue,
      value,
      onKeyDown,
      onValueChange,
      disabled = false,
    },
    ref
  ) => (
    <Select
      disabled={disabled}
      onValueChange={field ? field.onChange : onValueChange}
      defaultValue={placeholder ? undefined : field ? field.value : defaultValue}
      value={value ? value : fixedValue ? "" : undefined}
    >
      <SelectTrigger
        className={cn(className ? className : "w-full text-3xl h-16")}
        ref={ref}
        onKeyDown={(e) => {
          if (onKeyDown) {
            onKeyDown(e);
          } else {
            e.preventDefault();
          }
        }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {groups
          .filter((group) => group.items.length > 0)
          .map((group, groupIndex) => (
            <SelectGroup key={groupIndex}>
              {group.label && (
                <SelectLabel className="text-xl space-y-2">
                  <Separator orientation="horizontal" />
                  <div>{group.label}</div>
                </SelectLabel>
              )}

              {group.items.map((item, itemIndex) => (
                <SelectItem
                  key={itemIndex}
                  value={typeof item == "string" ? item : item.value}
                  className="text-xl"
                >
                  {typeof item == "string" ? item : item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
      </SelectContent>
    </Select>
  )
);

export default SelectWrapper;
