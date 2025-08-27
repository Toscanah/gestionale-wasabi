import { Button } from "@/components/ui/button";
import { Minus, Plus } from "@phosphor-icons/react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";

type Mode = "single" | "range";

interface DateShiftButtonProps {
  mode: Mode;
  value: Date | DateRange | undefined;
  onChange: (next: Date | DateRange) => void;
  amount: number;
}

export default function DateShiftButton({
  mode,
  value,
  onChange,
  amount,
}: DateShiftButtonProps) {
  const Icon = amount < 0 ? Minus : Plus;
  const absAmount = Math.abs(amount);

  const handleClick = () => {
    if (mode === "single") {
      const date = (value as Date | undefined) ?? new Date();
      onChange(addDays(date, amount));
    } else {
      const range = value as DateRange | undefined;
      const from = range?.from ?? new Date();
      const to = range?.to ?? new Date();
      onChange({
        from: addDays(from, amount),
        to: addDays(to, amount),
      });
    }
  };

  return (
    <Button className="h-8 w-full" variant="outline" onClick={handleClick}>
      <Icon className="h-4 w-4 mr-2" />
      {absAmount} giorni
    </Button>
  );
}
