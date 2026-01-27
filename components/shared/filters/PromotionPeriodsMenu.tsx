"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import WasabiPopover from "../wasabi/WasabiPopover";
import WasabiSelect from "../wasabi/WasabiSelect";
import { CalendarDotsIcon, CalendarIcon, X } from "@phosphor-icons/react";
import { DateRange } from "react-day-picker";
import {
  PromotionPeriodCondition,
  PromotionPeriodType,
} from "@/lib/shared/contracts/common/filters/promotion-periods";
import CalendarFilter from "./calendar/CalendarFilter";
import { endOfDay, startOfDay } from "date-fns";
import FilterTrigger from "./common/FilterTrigger";

const MAX_PERIODS = 3;

const PERIOD_TYPE_OPTIONS: Array<{ label: string; value: PromotionPeriodType }> = [
  { label: "Creazione", value: "creation" },
  { label: "Utilizzo", value: "usage" },
  { label: "Scadenza", value: "expiration" },
];

interface PromotionPeriodsMenuProps {
  activePeriods: PromotionPeriodCondition[];
  onChange: (periods: PromotionPeriodCondition[]) => void;
  triggerClassName?: string;
  disabled?: boolean;
}

export default function PromotionPeriodsMenu({
  activePeriods,
  onChange,
  triggerClassName,
  disabled,
}: PromotionPeriodsMenuProps) {
  const usedTypes = activePeriods.map((p) => p.type);
  const remainingPeriodTypes = PERIOD_TYPE_OPTIONS.filter((opt) => !usedTypes.includes(opt.value));

  // --- Update helpers ---
  const updatePeriod = (index: number, updated: Partial<PromotionPeriodCondition>) => {
    const newPeriods = activePeriods.map((p, i) => (i === index ? { ...p, ...updated } : p));
    onChange(newPeriods);
  };

  const removePeriod = (index: number) => {
    onChange(activePeriods.filter((_, i) => i !== index));
  };

  const addPeriod = () => {
    const firstAvailable = remainingPeriodTypes[0];
    if (!firstAvailable) return;

    onChange([
      ...activePeriods,
      {
        type: firstAvailable.value,
        from: undefined,
        to: undefined,
      },
    ]);
  };

  const clearPeriods = () => {
    onChange([]);
  };

  // --- Labels summary for trigger badges ---
  const summaryLabels = useMemo(() => {
    return activePeriods.map((p) => {
      const label = PERIOD_TYPE_OPTIONS.find((opt) => opt.value === p.type)?.label ?? p.type;
      return label;
    });
  }, [activePeriods]);

  return (
    <WasabiPopover
      modal={false}
      trigger={
        <FilterTrigger
          triggerIcon={CalendarDotsIcon}
          disabled={disabled}
          title="Periodi promozione"
          dashed
          onClear={activePeriods.length > 0 ? clearPeriods : undefined}
          values={activePeriods.map(
            (p) => PERIOD_TYPE_OPTIONS.find((opt) => opt.value === p.type)?.label ?? p.type
          )}
          className={triggerClassName}
        />
      }
      contentClassName="w-[700px] flex flex-col gap-4"
    >
      <span>Filtra per periodo</span>

      <div className="w-full flex flex-col gap-4 overflow-y-auto max-h-[350px]">
        {activePeriods.length > 0 ? (
          activePeriods.map((period, i) => {
            const selectableTypes = PERIOD_TYPE_OPTIONS.filter(
              (opt) => opt.value === period.type || !usedTypes.includes(opt.value)
            );

            const range: DateRange | undefined =
              period.from && period.to ? { from: period.from, to: period.to } : undefined;

            return (
              <div className="flex gap-4 items-center" key={`${period.type}-${i}`}>
                <WasabiSelect
                  appearance="form"
                  mode="single"
                  triggerClassName="w-[10rem]"
                  selectedValue={period.type}
                  onChange={(newType) => updatePeriod(i, { type: newType as PromotionPeriodType })}
                  groups={[
                    {
                      options: selectableTypes.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                      })),
                    },
                  ]}
                />

                <CalendarFilter
                  dashed={false}
                  mode="range"
                  useMonths
                  triggerClassName="flex-1"
                  usePresets
                  useYears
                  dateFilter={range}
                  disabled={disabled}
                  handleDateFilter={(newRange) =>
                    updatePeriod(i, { from: newRange?.from, to: newRange?.to })
                  }
                />

                <Button variant="outline" onClick={() => removePeriod(i)}>
                  <X size={20} />
                </Button>
              </div>
            );
          })
        ) : (
          <span className="mx-auto text-muted-foreground">Nessun periodo attivo</span>
        )}
      </div>

      <div className="w-full items-center flex gap-4">
        <Button
          onClick={addPeriod}
          className="flex-1"
          disabled={remainingPeriodTypes.length === 0 || activePeriods.length >= MAX_PERIODS}
        >
          {remainingPeriodTypes.length > 0 ? "Aggiungi periodo" : "Nessun periodo disponibile"}
        </Button>
      </div>
    </WasabiPopover>
  );
}
