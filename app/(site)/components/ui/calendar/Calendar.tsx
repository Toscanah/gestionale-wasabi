"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import SelectWrapper from "../select/SelectWrapper";
import { DateRange } from "react-day-picker";

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

export default function Calendar({
  dateFilter,
  handleDateFilter,
  mode,
  presets,
  handlePresetSelection,
  disabled = false,
}: CalendarProps) {
  const getButtonText = () => {
    if (mode === "single") {
      return dateFilter ? format(dateFilter as Date, "PPP", { locale: it }) : "Seleziona una data";
    } else {
      const range = dateFilter as DateRange;
      return range?.from
        ? range.to
          ? `${format(range.from, "PPP", { locale: it })} - ${format(range.to, "PPP", {
              locale: it,
            })}`
          : format(range.from, "PPP", { locale: it })
        : "Seleziona una data";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          id="date"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateFilter && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getButtonText()}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        {presets && handlePresetSelection && (
          <SelectWrapper
            onValueChange={handlePresetSelection}
            className="h-8"
            groups={[{ items: presets }]}
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
      </PopoverContent>
    </Popover>
  );
}
