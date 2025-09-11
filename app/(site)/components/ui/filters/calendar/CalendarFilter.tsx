"use client";

import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { startOfYear, endOfYear } from "date-fns";
import { it } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import WasabiPopover from "../../wasabi/WasabiPopover";
import { CalendarBlank, HashStraight, Lightning } from "@phosphor-icons/react";
import FilterTrigger from "../common/FilterTrigger";
import DateShiftButton from "./DateShiftButton";
import WasabiSelect from "../select/WasabiSelect";
import { DATE_FILTERING_PRESETS, DatePreset } from "@/app/(site)/lib/shared/enums/date-preset";
import getDateRangeFromPreset from "@/app/(site)/lib/utils/global/date/getDateRangeForPreset";
import formatDateFilter from "@/app/(site)/lib/utils/global/date/formatDateFilter";
import { Separator } from "@/components/ui/separator";
import { YEARS_SINCE_START } from "@/app/(site)/lib/shared/constants/starting-periods";

type SingleModeProps = {
  mode: "single";
  dateFilter: Date | undefined;
  handleDateFilter: (range: Date | undefined) => void;
  usePresets: never;
  useYears?: never;
  defaultValue?: Date | undefined;
};

type RangeModeProps = {
  mode: "range";
  dateFilter: DateRange | undefined;
  handleDateFilter: (range: DateRange | undefined) => void;
  useYears?: boolean;
  usePresets?: boolean;
  defaultValue?: DateRange | undefined;
};

type CalendarProps = {
  disabled?: boolean;
} & (SingleModeProps | RangeModeProps);

export default function CalendarFilter({
  dateFilter,
  handleDateFilter,
  mode,
  useYears,
  disabled = false,
  usePresets = true,
  defaultValue,
}: CalendarProps) {
  const label = formatDateFilter(mode, dateFilter);
  const values = label ? [label] : [];

  function normalizeDateFilter(val: Date | DateRange | undefined): [number?, number?] | undefined {
    if (!val) return undefined;
    if (val instanceof Date) {
      const t = val.getTime();
      return [t, t];
    }
    if (!val.from && !val.to) return undefined; // treat empty range as undefined
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

  return (
    <WasabiPopover
      contentClassName="flex flex-col gap-2 p-2"
      trigger={
        <FilterTrigger
          triggerIcon={CalendarBlank}
          disabled={disabled}
          title={mode === "single" ? "Data" : "Intervallo"}
          onClear={onClear}
          values={values}
        />
      }
    >
      <div className="w-full flex gap-2 items-center">
        {usePresets && mode === "range" && (
          <WasabiSelect
            triggerIcon={Lightning}
            mode="transient"
            triggerClassName="w-full border-solid"
            title="Date pronte"
            onChange={(updatedValue) =>
              handleDateFilter(getDateRangeFromPreset(updatedValue as DatePreset))
            }
            groups={[
              {
                options: DATE_FILTERING_PRESETS.map((preset) => ({
                  label: preset.name,
                  value: preset.value,
                })),
              },
            ]}
          />
        )}

        {useYears && mode === "range" && (
          <WasabiSelect
            triggerIcon={HashStraight}
            mode="transient"
            triggerClassName="w-full border-solid"
            title="Anni"
            onChange={(val) => {
              const y = parseInt(val, 10);
              handleDateFilter({
                from: startOfYear(new Date(y, 0, 1)),
                to: endOfYear(new Date(y, 11, 31)),
              });
            }}
            groups={[
              {
                options: [...(YEARS_SINCE_START ?? [])].map((y) => ({
                  label: String(y),
                  value: String(y),
                })),
              },
            ]}
          />
        )}
      </div>

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
            <Separator className="h-8" orientation="vertical" />
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
