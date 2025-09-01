import { useEffect, useState } from "react";
import { useWasabiContext } from "../../context/WasabiContext";
import { cn } from "@/lib/utils";
import formatRice from "../../lib/utils/domains/rice/formatRice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SHIFT_LABELS, ShiftFilterValue } from "../../lib/shared";

const STORAGE_KEY = "rice-summary-filter";

export default function RiceSummary() {
  const { rice } = useWasabiContext();
  const [filter, setFilter] = useState<ShiftFilterValue>(ShiftFilterValue.ALL);

  // Load stored value on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ShiftFilterValue | null;
    if (stored && Object.values(ShiftFilterValue).includes(stored)) {
      setFilter(stored);
    }
  }, []);

  // Save whenever filter changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, filter);
  }, [filter]);

  const consumedLunch = rice.total - rice.remainingLunch;
  const consumedDinner = rice.total - rice.remainingDinner;

  const calculatedRemaining =
    filter === "ALL"
      ? rice.remainingLunch + rice.remainingDinner - rice.total
      : filter === ShiftFilterValue.LUNCH
      ? rice.remainingLunch
      : rice.total - consumedLunch - consumedDinner;

  const calculatedConsumed =
    filter === "ALL"
      ? consumedLunch + consumedDinner
      : filter === ShiftFilterValue.LUNCH
      ? consumedLunch
      : consumedDinner;

  const summaryRows = [
    {
      label: "Riso consumato",
      value: calculatedConsumed,
      condition: filter === "ALL" && calculatedConsumed > rice.total,
    },
    {
      label: "Riso rimanente",
      value: calculatedRemaining,
      condition: filter === "ALL" && rice.total > 0 && calculatedRemaining < rice.threshold,
    },
    {
      label: "Fino alla soglia",
      value: rice.total === 0 ? 0 : calculatedRemaining - rice.threshold,
      condition: filter === "ALL" && rice.total > 0 && calculatedRemaining - rice.threshold <= 0,
      shouldStrike: filter !== "ALL",
    },
  ];

  const shiftOptions = Object.entries(SHIFT_LABELS).map(([value, label]) => ({
    label,
    value,
    id: value.toLowerCase().replace(" ", "-"),
  }));

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup
        value={filter}
        onValueChange={(val) => setFilter(val as ShiftFilterValue)}
        className="w-full flex gap-8 justify-end items-center"
      >
        {shiftOptions.map(({ label, value, id }) => (
          <div key={id} className="flex gap-2 items-center">
            <RadioGroupItem id={id} value={value} />
            <Label htmlFor={id} className="hover:cursor-pointer">
              {label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <table className="w-[28rem] text-2xl border-collapse">
        <tbody>
          {summaryRows.map(({ label, value, condition, shouldStrike = false }, index) => (
            <tr key={index}>
              <td
                className={cn(
                  "text-right text-2xl w-[60%]",
                  shouldStrike && "line-through text-muted-foreground"
                )}
              >
                {label}
              </td>
              <td
                className={cn(
                  "text-right font-bold pl-3 whitespace-pre",
                  condition && "text-red-600",
                  shouldStrike && "line-through text-muted-foreground"
                )}
              >
                {formatRice(value, true)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
