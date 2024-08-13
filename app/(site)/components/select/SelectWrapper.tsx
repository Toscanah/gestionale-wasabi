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
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  handleKeyDown?: (e: KeyboardEvent<any>) => void;
  groups: { label?: string; items: { value: string; name: string }[] | string[] }[];
  placeholder?: string;
  fixedValue?: boolean;
}

const SelectWrapper = forwardRef<HTMLButtonElement, SelectWrapperProps>(
  (
    {
      field,
      defaultValue,
      className,
      handleKeyDown,
      onValueChange,
      groups,
      placeholder,
      fixedValue,
    },
    ref
  ) => {
    return (
      <Select
        onValueChange={field ? field.onChange : onValueChange}
        defaultValue={field ? field.value : defaultValue}
        value={fixedValue ? "" : undefined}
      >
        <SelectTrigger
          className={cn(className ? className : "w-full text-3xl h-16")}
          ref={ref}
          onKeyDown={(e) => (handleKeyDown ? handleKeyDown(e) : e.preventDefault())}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {groups.map((group, groupIndex) => (
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
    );
  }
);

export default SelectWrapper;
