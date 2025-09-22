import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { TimeValue } from "./TimeWindowFilter";
import { Input } from "@/components/ui/input";
import useFocusOnClick from "@/app/(site)/hooks/focus/useFocusOnClick";

interface TimeInputProps {
  label: string;
  value: TimeValue; // controlled from parent
  onChange: (type: "h" | "m", val: string) => void;
}

export default function TimeInput({ label, value, onChange }: TimeInputProps) {
  const [localH, setLocalH] = useState(value.h);
  const [localM, setLocalM] = useState(value.m);

  // keep in sync if parent resets
  useEffect(() => {
    setLocalH(value.h);
    setLocalM(value.m);
  }, [value.h, value.m]);

  const handleChange = (type: "h" | "m") => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Only allow digits
    if (!/^\d*$/.test(val)) return;
    // Max 2 chars
    if (val.length > 2) val = val.slice(0, 2);

    // Update local immediately
    if (type === "h") setLocalH(val);
    else setLocalM(val);

    // Soft upper bound
    const num = parseInt(val || "0", 10);
    if (type === "h" && num > 23) val = "23";
    if (type === "m" && num > 59) val = "59";

    // Bubble up (debounced in parent)
    onChange(type, val);
  };

  const handleBlur = (type: "h" | "m", current: string) => {
    let next = current;
    if (current.length === 1) next = current.padStart(2, "0");
    if (current.length === 0) next = "00";

    if (type === "h") setLocalH(next);
    else setLocalM(next);

    onChange(type, next);
  };

  useFocusOnClick([label + "-h", label + "-m"]);

  return (
    <div className="flex gap-4 items-center">
      <Label>{label}</Label>
      <Input
        id={label + "-h"}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={localH}
        onChange={handleChange("h")}
        onBlur={() => handleBlur("h", localH)}
        className="w-14 text-center"
        placeholder="ore"
      />

      <span>:</span>

      <Input
        id={label + "-m"}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={localM}
        onChange={handleChange("m")}
        onBlur={() => handleBlur("m", localM)}
        className="w-14 text-center"
        placeholder="min"
      />
    </div>
  );
}
