import { Label } from "@/components/ui/label";
import { TimeValue } from "./TimePicker";
import { Input } from "@/components/ui/input";

function displayValue(v: string, type: "h" | "m"): string {
  if (v === "00") return "";
  if (type === "m") return v;
  return v.replace(/^0+(?=\d)/, "");
}

function sanitizeInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 2);
}

interface TimeInputProps {
  label: string;
  value: TimeValue;
  onChange: (type: "h" | "m", val: string) => void;
}

export default function TimeInput({ label, value, onChange }: TimeInputProps) {
  const handleChange = (type: "h" | "m") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    onChange(type, sanitized);
  };

  return (
    <div className="flex gap-4 items-center">
      <Label>{label}</Label>
      <Input
        type="text"
        inputMode="numeric"
        pattern="\d{1,2}"
        maxLength={2}
        value={displayValue(value.h, "h")}
        onChange={handleChange("h")}
        className="w-14 text-center"
        placeholder="ore"
      />
      <span>:</span>
      <Input
        type="text"
        inputMode="numeric"
        pattern="\d{1,2}"
        maxLength={2}
        value={displayValue(value.m, "m")}
        onChange={handleChange("m")}
        className="w-14 text-center"
        placeholder="min"
      />
    </div>
  );
}
