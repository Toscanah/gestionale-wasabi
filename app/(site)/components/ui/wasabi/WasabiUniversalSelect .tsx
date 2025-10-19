"use client";

import React, { forwardRef, useState, useMemo, Fragment, ElementRef, ElementType } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Check, Circle as CircleIcon } from "@phosphor-icons/react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
} from "@/components/ui/command";
import WasabiPopover from "./WasabiPopover";
import FilterTrigger from "../filters/common/FilterTrigger";
import capitalizeFirstLetter from "@/app/(site)/lib/utils/global/string/capitalizeFirstLetter";
import normalizeCase from "@/app/(site)/lib/utils/global/string/normalizeCase";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type CommandOption = {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  count?: number;
  disabled?: boolean;
};

export type CommandGroupType = {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  label?: string;
  options: CommandOption[];
};

/* ------------------------------ Mode props -------------------------------- */

interface BaseModeSingle {
  mode?: "single"; // default
  selectedValue?: string;
  onChange: (value: string) => void;
}

interface BaseModeMulti {
  mode: "multi";
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

interface BaseModeTransient {
  mode: "transient";
  onChange: (value: string) => void;
}

type ModeProps = BaseModeSingle | BaseModeMulti | BaseModeTransient;

/* -------------------------- Common select props --------------------------- */

interface CommonSelectProps {
  groups: CommandGroupType[];
  disabled?: boolean;
  showInput?: boolean;
  searchPlaceholder?: string;
  contentClassName?: string;
  itemClassName?: string;
  labelClassName?: string;
  allLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  filterFn?: (value: string, search: string) => number;
}

/* ------------------------------- FILTER props ----------------------------- */

interface FilterAppearanceProps {
  appearance: "filter";
  title: string;
  triggerIcon?: ElementType;
  triggerClassName?: string;
  shouldClear?: boolean;
  trigger?: (selected: CommandOption | undefined) => React.ReactNode;
}

/* -------------------------------- FORM props ------------------------------ */

interface FormAppearanceProps {
  appearance: "form";
  placeholder?: string;
  triggerClassName?: string;
  triggerIcon?: ElementType;
  trigger?: (selected: CommandOption | undefined) => React.ReactNode;
}

/* ----------------------------- Combined variants -------------------------- */

export type WasabiFilterSelectProps = CommonSelectProps & FilterAppearanceProps & ModeProps;

export type WasabiFormSelectProps = CommonSelectProps & FormAppearanceProps & ModeProps;

export type WasabiUniversalSelectProps = WasabiFilterSelectProps | WasabiFormSelectProps;

/* ------------------------------ Type guards -------------------------------- */

function isMulti(
  p: WasabiUniversalSelectProps
): p is (WasabiFilterSelectProps & BaseModeMulti) | (WasabiFormSelectProps & BaseModeMulti) {
  return p.mode === "multi";
}

function isTransient(
  p: WasabiUniversalSelectProps
): p is
  | (WasabiFilterSelectProps & BaseModeTransient)
  | (WasabiFormSelectProps & BaseModeTransient) {
  return p.mode === "transient";
}

function isSingle(
  p: WasabiUniversalSelectProps
): p is (WasabiFilterSelectProps & BaseModeSingle) | (WasabiFormSelectProps & BaseModeSingle) {
  // Treat undefined as "single" for DX
  return p.mode === "single" || p.mode === undefined;
}

/* -------------------------------------------------------------------------- */
/*                              Component Impl                                 */
/* -------------------------------------------------------------------------- */

const WasabiUniversalSelect = forwardRef<
  ElementRef<typeof WasabiPopover>,
  WasabiUniversalSelectProps
>((props, ref) => {
  const {
    groups,
    disabled,
    showInput = true,
    searchPlaceholder = "Cerca...",
    contentClassName,
    itemClassName,
    labelClassName,
    allLabel,
    open,
    onOpenChange,
    filterFn,
  } = props;

  // Controlled/uncontrolled open
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  /* ------------------------------- Selection -------------------------------- */

  const allOptions = useMemo(() => groups.flatMap((g) => g.options), [groups]);

  const normalizedSelection: string[] = isMulti(props)
    ? props.selectedValues
    : isSingle(props)
      ? [props.selectedValue ?? ""]
      : [];

  const selectedOptions =
    isMulti(props) && allLabel && normalizedSelection.length === allOptions.length
      ? [{ label: allLabel, value: "ALL" } as CommandOption]
      : allOptions
          .filter((o) => normalizedSelection.includes(o.value))
          .sort((a, b) => a.label.localeCompare(b.label));

  /* -------------------------------- Handlers -------------------------------- */

  const handleSelect = (option: CommandOption) => {
    if (isMulti(props)) {
      const current = props.selectedValues;
      const updated = current.includes(option.value)
        ? current.filter((v) => v !== option.value)
        : [...current, option.value];
      props.onChange(updated);
      return;
    }

    // single or transient
    props.onChange(option.value);

    // Close only for FORM appearance (filter typically stays open)
    // if (props.appearance === "form") {
    //   setOpen(false);
    // }
  };

  const handleReset = () => {
    if (isMulti(props)) props.onChange([]);
    else props.onChange("");
  };

  /* -------------------------------- Trigger UI ------------------------------ */

  let triggerNode: React.ReactNode;

  if (props.appearance === "filter") {
    const { title, triggerIcon, triggerClassName, shouldClear = true, trigger } = props;

    triggerNode = trigger ? (
      trigger(selectedOptions[0])
    ) : (
      <FilterTrigger
        onClear={isTransient(props) ? undefined : shouldClear ? handleReset : undefined}
        disabled={disabled}
        triggerIcon={triggerIcon}
        title={title}
        values={selectedOptions.map((o) => o.label)}
        className={triggerClassName}
      />
    );
  } else {
    const { placeholder = "Seleziona...", triggerClassName, triggerIcon, trigger } = props;
    const TriggerIcon = triggerIcon;

    triggerNode = trigger ? (
      trigger(selectedOptions[0])
    ) : (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        disabled={disabled}
        className={cn(
          "justify-between w-full text-sm overflow-hidden text-ellipsis whitespace-nowrap",
          triggerClassName
        )}
      >
        {/* FORM + MULTI: show all selected labels */}
        {isMulti(props) ? (
          selectedOptions.length > 0 ? (
            <span className="truncate">
              {selectedOptions.map((o) => normalizeCase(o.label)).join(", ")}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )
        ) : (
          <span>{normalizeCase(selectedOptions[0]?.label ?? placeholder)}</span>
        )}

        {TriggerIcon ? <TriggerIcon className="ml-2 h-4 w-4 opacity-60 flex-shrink-0" /> : null}
      </Button>
    );
  }

  /* --------------------------------- Render --------------------------------- */

  return (
    <WasabiPopover
      ref={ref}
      open={isOpen}
      onOpenChange={setOpen}
      trigger={triggerNode}
      contentClassName={cn("p-0", contentClassName)}
    >
      <Command filter={filterFn}>
        {showInput && <CommandInput placeholder={searchPlaceholder} className="h-9" />}
        <CommandList>
          <CommandEmpty>Nessun risultato trovato.</CommandEmpty>

          {groups.map((group, idx) => (
            <Fragment key={idx}>
              <CommandGroup
                heading={
                  group.label ? (
                    <div
                      className={cn(
                        "flex gap-2 items-center text-xs font-medium text-muted-foreground",
                        labelClassName
                      )}
                    >
                      {group.icon && <group.icon className="h-4 w-4" />} {group.label}
                    </div>
                  ) : undefined
                }
              >
                {group.options
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((option) => {
                    const isSelected = normalizedSelection.includes(option.value);

                    return (
                      <CommandItem
                        disabled={option.disabled}
                        key={option.value}
                        // set value=label for filtering by label
                        value={option.label}
                        onSelect={() => handleSelect(option)}
                        className={cn(
                          "w-full flex items-center justify-between text-sm",
                          itemClassName
                        )}
                      >
                        {/* Selection indicator */}
                        {isMulti(props) ? (
                          <Checkbox checked={isSelected} />
                        ) : isSingle(props) ? (
                          <CircleIcon weight={isSelected ? "fill" : "regular"} />
                        ) : null}

                        <div className="flex gap-2 items-center w-full leading-none">
                          {option.icon && <option.icon />}
                          {normalizeCase(option.label)}
                          {option.count && (
                            <span className="ml-auto font-mono text-muted-foreground">
                              {option.count}
                            </span>
                          )}
                        </div>

                        {/* Extra checkmark for form/single */}
                        {props.appearance === "form" &&
                          isSingle(props) &&
                          isSelected &&
                          !option.count && <Check className="ml-auto h-4 w-4 opacity-70" />}
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
              {idx < groups.length - 1 && <CommandSeparator />}
            </Fragment>
          ))}
        </CommandList>
      </Command>
    </WasabiPopover>
  );
});

WasabiUniversalSelect.displayName = "WasabiUniversalSelect";
export default WasabiUniversalSelect;
