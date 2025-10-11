"use client";

import React, { forwardRef, useState, Fragment, useMemo } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check } from "@phosphor-icons/react";
import WasabiPopover from "./WasabiPopover";
import { CommandGroupType } from "./WasabiSelect";

interface WasabiCommandSelectProps {
  field?: ControllerRenderProps<any>;
  groups: CommandGroupType[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  searchPlaceholder?: string;
}

const WasabiCommandSelect = forwardRef<HTMLButtonElement, WasabiCommandSelectProps>(
  (
    {
      field,
      groups,
      placeholder = "Seleziona...",
      searchPlaceholder = "Cerca...",
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      id,
      triggerClassName,
      contentClassName,
      itemClassName,
      labelClassName,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    const currentValue = value ?? field?.value ?? defaultValue ?? "";

    const handleChange = (val: string) => {
      if (field) field.onChange(val);
      if (onValueChange) onValueChange(val);
      setOpen(false);
    };

    const allOptions = useMemo(() => groups.flatMap((g) => g.options), [groups]);
    const selectedLabel =
      allOptions.find((item) => item.value === currentValue)?.label || placeholder;

    return (
      <WasabiPopover
        ref={ref as any}
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn("justify-between w-full text-sm", triggerClassName)}
          >
            {selectedLabel}
          </Button>
        }
        contentClassName={cn("p-0 w-[240px]", contentClassName)}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            {groups.map((group, groupIdx) => (
              <Fragment key={groupIdx}>
                <CommandGroup
                  heading={
                    group.label ? (
                      <div
                        className={cn("text-xs font-medium text-muted-foreground", labelClassName)}
                      >
                        {group.label}
                      </div>
                    ) : undefined
                  }
                >
                  {group.options.map((item) => {
                    const isSelected = item.value === currentValue;

                    return (
                      <CommandItem
                        key={item.value}
                        // 🔍 Important: set value to label for proper search filtering
                        value={item.label}
                        onSelect={() => handleChange(item.value)}
                        className={cn(
                          "w-full flex items-center justify-between text-sm",
                          itemClassName
                        )}
                      >
                        <span>{item.label}</span>
                        {isSelected && <Check className="h-4 w-4 opacity-70" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {groupIdx < groups.length - 1 && <CommandSeparator />}
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </WasabiPopover>
    );
  }
);

WasabiCommandSelect.displayName = "WasabiCommandSelect";

export default WasabiCommandSelect;
