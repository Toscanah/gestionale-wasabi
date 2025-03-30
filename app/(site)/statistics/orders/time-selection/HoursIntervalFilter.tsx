"use client";

import { useState } from "react";
import { SelectionProps } from "../Section";
import { Label } from "@/components/ui/label";
import SelectWrapper from "@/app/(site)/components/select/SelectWrapper";

export default function HoursIntervalFilter({
  selection: hours,
  dispatch,
}: SelectionProps<{ from: string; to: string }>) {
  const [error, setError] = useState<string | null>(null);

  const timeStringToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleTimeChange = (field: "from" | "to") => (newTime: string) => {
    const otherTime = field === "from" ? hours.to : hours.from;

    // If the other time is not set yet, skip validation
    if (!otherTime) {
      setError(null);
      dispatch({
        type: "SET_TIME",
        payload: { [field]: newTime },
      });
      return;
    }

    const newTimeMinutes = timeStringToMinutes(newTime);
    const otherTimeMinutes = timeStringToMinutes(otherTime);

    const isValid =
      field === "from" ? newTimeMinutes <= otherTimeMinutes : newTimeMinutes >= otherTimeMinutes;

    if (!isValid) {
      setError(`L'orario "${otherTime}" non è valido`);
      return;
    }

    setError(null);
    dispatch({
      type: "SET_TIME",
      payload: { [field]: newTime },
    });
  };

  // Generate time options every 15 minutes
  const generateTimeGroups = () => {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60)
        .toString()
        .padStart(2, "0");
      const m = (mins % 60).toString().padStart(2, "0");
      return `${h}:${m}`;
    };

    const buildRange = (start: string, end: string) => {
      const startMin = toMinutes(start);
      const endMin = toMinutes(end);
      const options = [];

      for (let i = startMin; i <= endMin; i += 5) {
        options.push({ value: formatTime(i), name: formatTime(i) });
      }

      return options;
    };

    return [
      {
        label: "Pranzo",
        items: buildRange("10:00", "15:00"),
      },
      {
        label: "Cena",
        items: buildRange("16:30", "23:00"),
      },
    ];
  };

  const timeGroups = generateTimeGroups();

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-4 items-center">
        <Label>From</Label>
        <SelectWrapper
          className="h-10 w-28"
          groups={timeGroups}
          value={hours.from}
          onValueChange={handleTimeChange("from")}
          placeholder="--:--"
        />
        <Label>To</Label>
        <SelectWrapper
          className="h-10 w-28"
          groups={timeGroups}
          value={hours.to}
          onValueChange={handleTimeChange("to")}
          placeholder="--:--"
        />
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
