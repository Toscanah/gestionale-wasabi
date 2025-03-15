"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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

type CalendarRangeProps = {
  dateFilter: DateRange | undefined;
  handleDateFilter: (range: DateRange | undefined) => void;
  disabled?: boolean;
} & (NoPresets | WithPresets);

export default function CalendarRange({
  dateFilter,
  handleDateFilter,
  presets,
  handlePresetSelection,
  disabled = false,
}: CalendarRangeProps) {
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
          {dateFilter?.from
            ? dateFilter.to
              ? `${format(dateFilter.from, "PPP", { locale: it })} - ${format(
                  dateFilter.to,
                  "PPP",
                  { locale: it }
                )}`
              : format(dateFilter.from, "PPP", { locale: it })
            : "Seleziona una data"}
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
          <Calendar
            locale={it}
            mode="range"
            initialFocus
            defaultMonth={dateFilter?.from}
            selected={dateFilter}
            onSelect={(range) =>
              handleDateFilter(range && range.from ? { from: range.from, to: range.to } : undefined)
            }
            numberOfMonths={2}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
