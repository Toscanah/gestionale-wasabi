import { useState } from "react";
import { SelectionProps } from "../Section";
import { Label } from "@/components/ui/label";
import TimePicker from "@/app/(site)/components/ui/TimePicker";

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

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-4 items-center">
        <Label>From</Label>
        <TimePicker value={hours.from} onValueChange={handleTimeChange("from")} />
        <Label>To</Label>
        <TimePicker value={hours.to} onValueChange={handleTimeChange("to")} />
      </div>
        {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
