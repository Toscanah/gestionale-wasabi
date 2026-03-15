import { Button } from "@/components/ui/button";
import { Minus, Plus } from "@phosphor-icons/react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

type Mode = "single" | "range";

interface DateShiftButtonProps {
  value: Date | DateRange | undefined;
  onChange: (next: Date | DateRange) => void;
  amount: number;
}

export default function DateShiftButton({ value, onChange, amount }: DateShiftButtonProps) {
  const Icon = amount < 0 ? Minus : Plus;
  const absAmount = Math.abs(amount);

  const handleClick = () => {
    if (!value) return;

    // RANGE: { from, to }
    if (typeof value === "object" && "from" in value) {
      const from = value.from ? addDays(value.from, amount) : undefined;
      const to = value.to ? addDays(value.to, amount) : undefined;
      onChange({ from, to } as DateRange);
    }

    // SINGLE: Date
    else if (value instanceof Date) {
      onChange(addDays(value, amount));
    }
  };

  return (
    <Button className="h-8 flex-1" variant="outline" onClick={handleClick}>
      <Icon className="h-4 w-4 " />
      {absAmount} giorni
    </Button>
  );
}
