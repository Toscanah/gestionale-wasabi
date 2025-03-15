import { SelectionProps } from "../Section";
import { Label } from "@/components/ui/label";
import TimePicker from "@/app/(site)/components/ui/TimePicker";

export default function HoursIntervalFilter({
  selection: hours,
  dispatch,
}: SelectionProps<{ from: string; to: string }>) {
  const handleTimeChange = (field: "from" | "to") => (newTime: string) =>
    dispatch({
      type: "SET_TIME",
      payload: { ...hours, type: "range", [field]: newTime },
    });

  return (
    <div className="flex gap-4 items-center">
      <Label>dalle</Label>
      <TimePicker value={hours.from} onValueChange={handleTimeChange("from")} />
      <Label>alle</Label>
      <TimePicker value={hours.to} onValueChange={handleTimeChange("to")} />
    </div>
  );
}
