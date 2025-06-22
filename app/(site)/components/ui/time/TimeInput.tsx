import { Label } from "@/components/ui/label";
import { TimeValue } from "./TimePicker";
import { Input } from "@/components/ui/input";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";

interface TimeInputProps {
  label: string;
  value: TimeValue;
  onChange: (type: "h" | "m", val: string) => void;
}

export default function TimeInput({ label, value, onChange }: TimeInputProps) {
  const handleChange = (type: "h" | "m") => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(type, e.target.value);

  useFocusOnClick([label + "-h", label + "-m"]);

  return (
    <div className="flex gap-4 items-center">
      <Label>{label}</Label>
      <Input
        id={label + "-h"}
        type="text"
        maxLength={2}
        value={value.h}
        onChange={handleChange("h")}
        className="w-14 text-center"
        placeholder="ore"
      />

      <span>:</span>

      <Input
        id={label + "-m"}
        type="text"
        maxLength={2}
        value={value.m}
        onChange={handleChange("m")}
        className="w-14 text-center"
        placeholder="min"
      />
    </div>
  );
}
