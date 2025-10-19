"use client";

import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { startOfYear, endOfYear, startOfMonth, endOfMonth } from "date-fns";
import { it } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import WasabiPopover from "../../wasabi/WasabiPopover";
import { CalendarBlank, CalendarIcon, HashStraight, Lightning } from "@phosphor-icons/react";
import FilterTrigger from "../common/FilterTrigger";
import DateShiftButton from "./DateShiftButton";
import WasabiSelect from "../../wasabi/WasabiSelect";
import { DATE_FILTERING_PRESETS, DatePreset } from "@/app/(site)/lib/shared/enums/date-preset";
import getDateRangeFromPreset from "@/app/(site)/lib/utils/global/date/getDateRangeForPreset";
import formatDateFilter from "@/app/(site)/lib/utils/global/date/formatDateFilter";
import { Separator } from "@/components/ui/separator";
import { YEARS_SINCE_START } from "@/app/(site)/lib/shared/constants/starting-periods";
import { ITALIAN_MONTHS } from "@/app/(site)/lib/shared";
import WasabiUniversalSelect from "../../wasabi/WasabiUniversalSelect ";
import { useEffect, useState } from "react";
import DatePresets from "./presets/DatePresets";
import YearPresets from "./presets/YearPresets";
import MonthPresets from "./presets/MonthPresets";

type SingleModeProps = {
  mode: "single";
  dateFilter: Date | undefined;
  handleDateFilter: (range: Date | undefined) => void;
  usePresets?: never;
  useYears?: never;
  useMonths?: never;
  defaultValue?: Date | undefined;
};

export type RangeModeProps = {
  mode: "range";
  dateFilter: DateRange | undefined;
  handleDateFilter: (range: DateRange | undefined) => void;
  useYears?: boolean;
  usePresets?: boolean;
  useMonths?: boolean;
  defaultValue?: DateRange | undefined;
};

type CalendarProps = {
  disabled?: boolean;
  title?: string;
} & (SingleModeProps | RangeModeProps);

const PRESETS_CLASSNAME = "flex-1 border-solid";

export default function CalendarFilter({
  dateFilter,
  handleDateFilter,
  mode,
  useYears,
  disabled = false,
  usePresets = true,
  useMonths = true,
  defaultValue,
  title,
}: CalendarProps) {
  const label = formatDateFilter(mode, dateFilter);
  const values = label ? [label] : [];

  const [visibleMonth, setVisibleMonth] = useState<Date>(
    mode === "range"
      ? ((dateFilter as DateRange)?.from ?? new Date())
      : ((dateFilter as Date) ?? new Date())
  );

  function normalizeDateFilter(val: Date | DateRange | undefined): [number?, number?] | undefined {
    if (!val) return undefined;
    if (val instanceof Date) {
      const t = val.getTime();
      return [t, t];
    }
    if (!val.from && !val.to) return undefined;
    return [val.from?.getTime(), val.to?.getTime()];
  }

  function isEqualDateFilter(a: Date | DateRange | undefined, b: Date | DateRange | undefined) {
    const na = normalizeDateFilter(a);
    const nb = normalizeDateFilter(b);

    if (!na && !nb) return true;
    if (!na || !nb) return false;

    return na[0] === nb[0] && na[1] === nb[1];
  }

  const onClear =
    mode === "single"
      ? isEqualDateFilter(dateFilter, defaultValue)
        ? undefined
        : () => handleDateFilter(defaultValue as Date | undefined)
      : isEqualDateFilter(dateFilter, defaultValue)
        ? undefined
        : () =>
            handleDateFilter(
              defaultValue == undefined
                ? { from: undefined, to: undefined }
                : (defaultValue as DateRange)
            );

  useEffect(() => {
    if (mode === "range" && dateFilter?.from) {
      setVisibleMonth(dateFilter.from);
    } else if (mode === "single" && dateFilter) {
      setVisibleMonth(dateFilter as Date);
    }
  }, [dateFilter, mode]);

  const handleCalendarSelect = (selected: Date | DateRange | undefined) => {
    if (mode === "range") {
      if (selected && "from" in selected && "to" in selected) {
        handleDateFilter(selected as DateRange);
      } else {
        handleDateFilter(undefined);
      }
    } else {
      handleDateFilter(selected as Date);
    }
  };

  return (
    <WasabiPopover
      contentClassName="flex flex-col gap-2 p-2"
      trigger={
        <FilterTrigger
          triggerIcon={CalendarBlank}
          disabled={disabled}
          title={title ? title : mode === "single" ? "Data" : "Intervallo"}
          onClear={onClear}
          values={values}
        />
      }
    >
      <div className="w-full flex gap-2 items-center">
        {usePresets && mode === "range" && (
          <DatePresets handleDateFilter={handleDateFilter} triggerClassName={PRESETS_CLASSNAME} />
        )}

        {useYears && mode === "range" && (
          <YearPresets handleDateFilter={handleDateFilter} triggerClassName={PRESETS_CLASSNAME} />
        )}

        {useMonths && mode === "range" && (
          <MonthPresets
            handleDateFilter={handleDateFilter}
            triggerClassName={PRESETS_CLASSNAME}
            setVisibleMonth={setVisibleMonth}
          />
        )}
      </div>

      <div className="rounded-md border">
        <ShadCalendar
          locale={it}
          mode={mode as any}
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          defaultMonth={
            mode === "range"
              ? ((dateFilter as DateRange)?.from ?? new Date())
              : ((dateFilter as Date) ?? new Date())
          }
          selected={dateFilter}
          onSelect={handleCalendarSelect}
          numberOfMonths={3}
        />
      </div>

      <div className="flex gap-2">
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
              amount={-1}
            />
            <DateShiftButton
              mode="range"
              value={dateFilter}
              onChange={(next) => handleDateFilter(next as DateRange)}
              amount={+1}
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
