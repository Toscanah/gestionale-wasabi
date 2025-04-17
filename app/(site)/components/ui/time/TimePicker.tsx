"use client";

import { useCallback, useEffect, useState } from "react";
import TimeInput from "./TimeInput";

export type TimeValue = { h: string; m: string };
type Field = "from" | "to";

type TimePickerProps = {
  from: string;
  to: string;
  onChange: (field: Field, value: string) => void;
  labelFrom?: string;
  labelTo?: string;
};

function parseTime(time?: string): TimeValue {
  if (!time || typeof time !== "string" || !time.includes(":")) {
    return { h: "00", m: "00" };
  }

  const [h = "00", m = "00"] = time.split(":");
  return { h, m };
}

function buildTime({ h, m }: TimeValue): string {
  const paddedH = String(parseInt(h || "0", 10)).padStart(2, "0");
  const paddedM = String(parseInt(m || "0", 10)).padStart(2, "0");
  return `${paddedH}:${paddedM}`;
}

export default function TimePicker({
  from,
  to,
  onChange,
  labelFrom = "dalle",
  labelTo = "alle",
}: TimePickerProps) {
  const [fromState, setFromState] = useState<TimeValue>(parseTime(from));
  const [toState, setToState] = useState<TimeValue>(parseTime(to));

  const updateTime = useCallback(
    (field: Field, type: "h" | "m", val: string) => {
      const updated = { ...(field === "from" ? fromState : toState), [type]: val };

      if (field === "from") setFromState(updated);
      else setToState(updated);

      onChange(field, buildTime(updated));
    },
    [fromState, toState, onChange]
  );

  useEffect(() => {
    setFromState(parseTime(from));
    setToState(parseTime(to));
  }, [from, to]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-4 items-center">
        <TimeInput
          label={labelFrom}
          value={fromState}
          onChange={(type, val) => updateTime("from", type, val)}
        />
        <TimeInput
          label={labelTo}
          value={toState}
          onChange={(type, val) => updateTime("to", type, val)}
        />
      </div>
    </div>
  );
}
