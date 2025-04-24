import { Label } from "@/components/ui/label";
import { TimeValue } from "./TimePicker";
import { Input } from "@/components/ui/input";
import useFocusOnClick from "@/app/(site)/hooks/useFocusOnClick";

function displayValue(v: string, type: "h" | "m"): string {
  return v; // Pad single digit with leading zero
}

function sanitizeInput(raw: string): string {
  return raw
  // return raw.replace(/\D/g, "").slice(0, 2); // Keep only digits and limit to 2 characters
}

// function sanitizeInput(raw: string, type: "h" | "m"): string {
//   const sanitized = raw.replace(/\D/g, "").slice(0, 2); // Keep only digits and limit to 2 characters
//   const value = parseInt(sanitized, 10);

//   if (isNaN(value)) return ""; // Return empty if the input is not a number

//   if (type === "h") {
//     return Math.min(Math.max(value, 0), 23).toString(); // Clamp hours between 0 and 23
//   } else if (type === "m") {
//     return Math.min(Math.max(value, 0), 59).toString(); // Clamp minutes between 0 and 59
//   }

//   return sanitized;
// }

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

  useFocusOnClick([label + "-h", label + "-m"]);

  return (
    <div className="flex gap-4 items-center">
      <Label>{label}</Label>
      <Input
        id={label + "-h"}
        type="number"
        // pattern="\d{1,2}"
        maxLength={2}
        value={displayValue(value.h, "h")}
        onChange={handleChange("h")}
        className="w-14 text-center"
        placeholder="ore"
      />
      <span>:</span>
      <Input
        id={label + "-m"}
        type="number"
        // pattern="\d{1,2}"
        maxLength={2}
        value={displayValue(value.m, "m")}
        onChange={handleChange("m")}
        className="w-14 text-center"
        placeholder="min"
      />
    </div>
  );
}
