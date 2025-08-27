"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { it } from "date-fns/locale";
import WasabiSingleSelect from "../../select/WasabiSingleSelect";
import { DateRange } from "react-day-picker";
import WasabiPopover from "../../popover/WasabiPopover";
import SelectFilter from "../SelectFilter";
import { Lightning, Minus, Plus } from "@phosphor-icons/react";
import FilterTrigger from "../common/FilterTrigger";
import DateShiftButton from "./DateShiftButton";

export type CalendarRangePreset = {
  name: string;
  value: string;
};

type NoPresets = {
  presets?: never;
  handlePresetSelection?: never;
};

type WithPresets = {
  presets: CalendarRangePreset[];
  handlePresetSelection: (value: string) => void;
};

type CalendarBaseProps = {
  disabled?: boolean;
} & (NoPresets | WithPresets);

type SingleModeProps = {
  mode: "single";
  dateFilter: Date | undefined;
  handleDateFilter: (range: Date | undefined) => void;
};

type RangeModeProps = {
  mode: "range";
  dateFilter: DateRange | undefined;
  handleDateFilter: (range: DateRange | undefined) => void;
};

type CalendarProps = CalendarBaseProps & (SingleModeProps | RangeModeProps);

export default function CalendarFilter({
  dateFilter,
  handleDateFilter,
  mode,
  presets,
  handlePresetSelection,
  disabled = false,
}: CalendarProps) {
  const formatDateButtonText = () => {
    if (mode === "single") {
      return dateFilter ? format(dateFilter as Date, "PPP", { locale: it }) : "Da sempre";
    } else {
      const range = dateFilter as DateRange;
      return range?.from
        ? range.to
          ? `${format(range.from, "PPP", { locale: it })} - ${format(range.to, "PPP", {
              locale: it,
            })}`
          : format(range.from, "PPP", { locale: it })
        : "Da sempre";
    }
  };

  return (
    <WasabiPopover
      contentClassName="flex flex-col gap-2 p-2"
      trigger={
        <FilterTrigger
          disabled={disabled}
          title="Intervallo date"
          onClear={() => handleDateFilter(undefined)}
          labels={[formatDateButtonText()]}
        />
      }
    >
      {presets && handlePresetSelection && (
        <SelectFilter
          triggerIcon={Lightning}
          showInput={false}
          mode="transient"
          triggerClassName="w-full border-solid"
          title="Scelte rapide"
          onChange={(value) => value !== null && handlePresetSelection(value)}
          groups={[
            { options: presets.map((preset) => ({ label: preset.name, value: preset.value })) },
          ]}
        />
      )}

      <div className="rounded-md border">
        <ShadCalendar
          locale={it}
          mode={mode as any}
          initialFocus
          defaultMonth={
            mode === "range"
              ? (dateFilter as DateRange)?.from ?? new Date()
              : (dateFilter as Date) ?? new Date()
          }
          selected={dateFilter}
          onSelect={(range: any) => {
            if (mode === "range") {
              if (range && "from" in range && "to" in range) {
                handleDateFilter(range as DateRange);
              } else {
                handleDateFilter(undefined);
              }
            } else {
              handleDateFilter(range as Date);
            }
          }}
          numberOfMonths={mode === "range" ? 2 : 1}
        />
      </div>

      <div className="flex gap-2 text-xs">
        {mode === "single" ? (
          <>
            <DateShiftButton
              mode="single"
              value={dateFilter}
              onChange={(next) => handleDateFilter(next as Date)}
              amount={-1}
            />
            <DateShiftButton
              mode="single"
              value={dateFilter}
              onChange={(next) => handleDateFilter(next as Date)}
              amount={+1}
            />
          </>
        ) : (
          <>
            <DateShiftButton
              mode="range"
              value={dateFilter}
              onChange={(next) => handleDateFilter(next as DateRange)}
              amount={-30}
            />
            <DateShiftButton
              mode="range"
              value={dateFilter}
              onChange={(next) => handleDateFilter(next as DateRange)}
              amount={-7}
            />
            <DateShiftButton
              mode="range"
              value={dateFilter}
              onChange={(next) => handleDateFilter(next as DateRange)}
              amount={+7}
            />
            <DateShiftButton
              mode="range"
              value={dateFilter}
              onChange={(next) => handleDateFilter(next as DateRange)}
              amount={30}
            />
          </>
        )}
      </div>
    </WasabiPopover>
  );
}
