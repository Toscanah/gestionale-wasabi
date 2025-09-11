"use client";

import { useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import WasabiPopover from "../../wasabi/WasabiPopover";
import FilterTrigger from "../common/FilterTrigger";
import TimeInput from "./TimeInput";
import { Clock } from "@phosphor-icons/react";

export type TimeValue = { h: string; m: string };

export type TimeWindow = {
  from: string; // "HH:mm"
  to: string; // "HH:mm"
};

interface TimeWindowFilterProps {
  window: TimeWindow; // pass FULL_DAY_RANGE for “all day”
  onWindowChange: (updatedWindow: TimeWindow) => void; // controlled
  labelFrom?: string;
  labelTo?: string;
  className?: string;
  disabled?: boolean;
}

function parseTime(time?: string): TimeValue {
  if (!time || typeof time !== "string" || !time.includes(":")) {
    return { h: "00", m: "00" };
  }

  const [h = "00", m = "00"] = time.split(":");
  return { h, m };
}
const buildTime = ({ h, m }: TimeValue): string => `${h}:${m}`;

export const FULL_DAY_RANGE: TimeWindow = { from: "00:00", to: "23:59" };

export default function TimeWindowFilter({
  window,
  onWindowChange,
  labelFrom = "Dalle",
  labelTo = "Alle",
  className,
  disabled,
}: TimeWindowFilterProps) {
  // Normalize: we always work against a concrete range; parent can pass FULL_DAY_RANGE for “all day”
  const effective = window ?? FULL_DAY_RANGE;

  const isFullDay = effective.from === FULL_DAY_RANGE.from && effective.to === FULL_DAY_RANGE.to;

  const fromState = parseTime(effective.from);
  const toState = parseTime(effective.to);

  // Debounce the onWindowChange callback
  const debouncedOnWindowChange = useMemo(() => debounce(onWindowChange, 500), [onWindowChange]);

  useEffect(() => {
    return () => {
      debouncedOnWindowChange.cancel();
    };
  }, [debouncedOnWindowChange]);

  const commit = (next: TimeWindow) =>
    debouncedOnWindowChange(
      next.from === FULL_DAY_RANGE.from && next.to === FULL_DAY_RANGE.to ? FULL_DAY_RANGE : next
    );

  const update = (field: "from" | "to", type: "h" | "m", val: string) => {
    if (field === "from") {
      const nextFrom = buildTime({ ...fromState, [type]: val });
      commit({ from: nextFrom, to: effective.to });
    } else {
      const nextTo = buildTime({ ...toState, [type]: val });
      commit({ from: effective.from, to: nextTo });
    }
  };

  const chipLabel = isFullDay ? "Tutto il giorno" : `${effective.from} – ${effective.to}`;

  return (
    <WasabiPopover
      contentClassName="p-4"
      trigger={
        <FilterTrigger
          disabled={disabled}
          triggerIcon={Clock}
          title="Fascia oraria"
          values={chipLabel ? [chipLabel] : []}
          onClear={!isFullDay ? () => onWindowChange(FULL_DAY_RANGE) : undefined}
        />
      }
    >
      <div className={`flex flex-col gap-2 items-center ${className || ""}`}>
        <div className="flex gap-4 items-center">
          <TimeInput
            label={labelFrom}
            value={fromState}
            onChange={(type, val) => update("from", type, val)}
          />
          <TimeInput
            label={labelTo}
            value={toState}
            onChange={(type, val) => update("to", type, val)}
          />
        </div>
      </div>
    </WasabiPopover>
  );
}
