import { useState } from "react";
import { useWasabiContext } from "../../context/WasabiContext";
import { cn } from "@/lib/utils";
import { ShiftType } from "../../lib/shared/enums/Shift";
import formatRice from "../../lib/formatting-parsing/formatRice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function RiceSummary() {
  const { rice } = useWasabiContext();
  const [filter, setFilter] = useState<ShiftType>(ShiftType.ALL);

  const consumedLunch = rice.total - rice.remainingLunch;
  const consumedDinner = rice.total - rice.remainingDinner;

  const remaining =
    filter === ShiftType.ALL
      ? rice.remainingLunch + rice.remainingDinner - rice.total
      : filter === ShiftType.LUNCH
      ? rice.remainingLunch
      : rice.remainingDinner;

  const consumed =
    filter === ShiftType.ALL
      ? consumedLunch + consumedDinner
      : filter === ShiftType.LUNCH
      ? consumedLunch
      : consumedDinner;

  const summaryRows = [
    {
      label: "Riso consumato",
      value: consumed,
      condition: filter === ShiftType.ALL && consumed > rice.total,
    },
    {
      label: "Riso rimanente",
      value: remaining,
      condition: filter === ShiftType.ALL && remaining < rice.threshold,
    },
    {
      label: "Fino alla soglia",
      value: remaining - rice.threshold,
      condition: filter === ShiftType.ALL && remaining - rice.threshold <= 0,
      shouldStrike: filter !== ShiftType.ALL,
    },
  ];

  const shiftOptions = [
    { label: "Pranzo", value: ShiftType.LUNCH, id: "lunch" },
    { label: "Cena", value: ShiftType.DINNER, id: "dinner" },
    { label: "Pranzo + cena", value: ShiftType.ALL, id: "all" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <RadioGroup
        value={filter}
        onValueChange={(val) => setFilter(val as ShiftType)}
        className="w-full flex gap-16 justify-end items-center"
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
