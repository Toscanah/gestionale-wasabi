"use client";

import TimePicker from "@/app/(site)/components/ui/time/TimePicker";
import { SelectionProps } from "../Section";

export default function HoursIntervalFilter({
  selection: hours,
  dispatch,
}: SelectionProps<{ from: string; to: string }>) {
  return (
    <TimePicker
      from={hours.from}
      to={hours.to}
      onChange={(field, value) =>
        dispatch({
          type: "SET_TIME",
          payload: { [field]: value },
        })
      }
    />
  );
}
