"use client";

import { useState } from "react";
import { SelectionProps } from "../Section";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function HoursIntervalFilter({
  selection: hours,
  dispatch,
}: SelectionProps<{ from: string; to: string }>) {
  const buildTime = (h: string, m: string) => {
    const paddedH = h.padStart(2, "0");
    const paddedM = m.padStart(2, "0");
    return `${paddedH}:${paddedM}`;
  };

  const parseTime = (time: string) => {
    const [h, m] = time.split(":");
    return { h, m };
  };

  const [from, setFrom] = useState(parseTime(hours.from || "00:00"));
  const [to, setTo] = useState(parseTime(hours.to || "00:00"));

  const handleChange = (field: "from" | "to", type: "h" | "m") => (val: string) => {
    const newTime = { ...(field === "from" ? from : to), [type]: val };
    const fullTime = buildTime(newTime.h, newTime.m);

    dispatch({
      type: "SET_TIME",
      payload: { [field]: fullTime },
    });

    field === "from" ? setFrom(newTime) : setTo(newTime);
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-4 items-center">
        <Label>Dalle</Label>
        <div className="flex gap-1 items-center">
          <Input
            type="number"
            min={0}
            max={23}
            maxLength={2}
            value={from.h === "00" ? "" : from.h}
            onChange={(e) => handleChange("from", "h")(e.target.value)}
            className="w-14 text-center"
            placeholder="ore"
          />
          <span>:</span>
          <Input
            type="number"
            min={0}
            max={59}
            maxLength={2}
            value={from.m === "00" ? "" : from.m}
            onChange={(e) => handleChange("from", "m")(e.target.value)}
            className="w-14 text-center"
            placeholder="min"
          />
        </div>

        <Label>alle</Label>
        <div className="flex gap-1 items-center">
          <Input
            type="number"
            min={0}
            max={23}
            maxLength={2}
            value={to.h === "00" ? "" : to.h}
            onChange={(e) => handleChange("to", "h")(e.target.value)}
            className="w-14 text-center"
            placeholder="ore"
          />
          <span>:</span>
          <Input
            type="number"
            min={0}
            max={59}
            maxLength={2}
            value={to.m === "00" ? "" : to.m}
            onChange={(e) => handleChange("to", "m")(e.target.value)}
            className="w-14 text-center"
            placeholder="min"
          />
        </div>
      </div>
    </div>
  );
}
