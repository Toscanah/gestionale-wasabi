"use client";

import { forwardRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { it, Locale } from "date-fns/locale";
import { CalendarBlank, Check } from "@phosphor-icons/react";
import WasabiPopover from "../wasabi/WasabiPopover";
import FilterTrigger from "../filters/common/FilterTrigger";
import DatePresets from "../filters/calendar/presets/DatePresets";
import MonthPresets from "../filters/calendar/presets/MonthPresets";
import YearPresets from "../filters/calendar/presets/YearPresets";
import DateShiftButton from "../filters/calendar/DateShiftButton";
import formatDateFilter from "@/app/(site)/lib/utils/global/date/formatDateFilter";
import { cn } from "@/lib/utils";

export type DateModeSingle = {
  mode: "single";
  value?: Date;
  onChange: (date: Date | undefined) => void;
};

export type DateModeRange = {
  mode: "range";
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
};

type BaseDatePickerProps = {
  disabled?: boolean;
  showPresets?: boolean;
  showShiftButtons?: boolean;
  locale?: Locale;
  defaultValue?: Date | DateRange;
  className?: string;
  triggerClassName?: string;
  title?: string;
};

/* ------------------------------ Appearance ------------------------------ */

type FilterAppearance = {
  appearance: "filter";
  dashed?: boolean;
};

type FormAppearance = {
  appearance: "form";
  placeholder?: string;
};

/* ------------------------------ Combined ------------------------------ */

export type WasabiDatePickerProps =
  | (BaseDatePickerProps & FilterAppearance & DateModeSingle)
  | (BaseDatePickerProps & FilterAppearance & DateModeRange)
  | (BaseDatePickerProps & FormAppearance & DateModeSingle)
  | (BaseDatePickerProps & FormAppearance & DateModeRange);

const PRESETS_CLASSNAME = "flex-1 border-solid";

const WasabiDatePicker = forwardRef<HTMLDivElement, WasabiDatePickerProps>((props, ref) => {
  const {
    mode,
    value,
    onChange,
    disabled,
    locale = it,
    appearance,
    title,
    dashed = true,
    showPresets = true,
    showShiftButtons = true,
    triggerClassName,
    placeholder = "Seleziona data...",
  } = props as any;

  /* --------------------------- Derived State --------------------------- */

  const label = formatDateFilter(mode, value);
  const values = label ? [label] : [];

  /* ----------------------------- Handlers ------------------------------ */

  const handleSelect = (selected: Date | DateRange | undefined) => {
    onChange(selected);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  /* --------------------------- Trigger UI --------------------------- */

  const triggerNode =
    appearance === "filter" ? (
      <FilterTrigger
        dashed={dashed}
        triggerIcon={CalendarBlank}
        disabled={disabled}
        title={title ?? (mode === "range" ? "Intervallo" : "Data")}
        values={values}
        onClear={value ? handleClear : undefined}
        className={triggerClassName}
      />
    ) : (
      <Button
        variant="outline"
        disabled={disabled}
        className={cn("justify-between w-full", triggerClassName)}
      >
        {label || placeholder}
        <CalendarBlank className="ml-2 h-4 w-4 opacity-60 flex-shrink-0" />
      </Button>
    );

  /* ----------------------------- Render ------------------------------ */

  return (
    <WasabiPopover trigger={triggerNode} contentClassName="flex flex-col gap-2 p-2">
      {mode === "range" && showPresets && (
        <div className="flex gap-2">
          <>
            <DatePresets handleDateFilter={onChange} triggerClassName={PRESETS_CLASSNAME} />
            <MonthPresets handleDateFilter={onChange} triggerClassName={PRESETS_CLASSNAME} />
            <YearPresets handleDateFilter={onChange} triggerClassName={PRESETS_CLASSNAME} />
          </>
        </div>
      )}

      <div className="rounded-md border">
        <ShadCalendar
          locale={locale}
          mode={mode as any}
          selected={value}
          onSelect={handleSelect}
          numberOfMonths={3}
        />
      </div>

      {showShiftButtons && (
        <div className="flex gap-2">
          <DateShiftButton value={value} onChange={onChange} amount={-30} />
          <DateShiftButton value={value} onChange={onChange} amount={-7} />
          <DateShiftButton value={value} onChange={onChange} amount={-1} />
          <DateShiftButton value={value} onChange={onChange} amount={+1} />
          <DateShiftButton value={value} onChange={onChange} amount={+7} />
          <DateShiftButton value={value} onChange={onChange} amount={+30} />
        </div>
      )}
    </WasabiPopover>
  );
});

WasabiDatePicker.displayName = "WasabiDatePicker";
export default WasabiDatePicker;
