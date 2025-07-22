import { cn } from "@/lib/utils";
import { useWasabiContext } from "../../context/WasabiContext";
import formatRice from "../../lib/formatting-parsing/formatRice";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function RiceSummary() {
  const { rice, lunchRice, dinnerRice } = useWasabiContext();

  const [filters, setFilters] = useState({
    lunch: true,
    dinner: true,
  });

  const toggleFilter = (key: "lunch" | "dinner") =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));

  const isLunch = filters.lunch;
  const isDinner = filters.dinner;

  const consumed = (() => {
    if (isLunch && isDinner) return lunchRice + dinnerRice;
    if (isLunch) return lunchRice;
    if (isDinner) return dinnerRice;
    return rice.total - rice.remaining; // fallback: full day
  })();

  const remaining = (() => {
    if (isLunch && isDinner) return rice.total - (lunchRice + dinnerRice);
    if (isLunch) return rice.total - lunchRice;
    if (isDinner) return rice.total - dinnerRice;
    return rice.remaining;
  })();

  const calculateStyles = (condition: boolean) =>
    cn("text-right font-bold pl-3", condition && "text-red-600");

  const summaryRows = [
    {
      label: "Riso consumato",
      value: consumed,
      condition: consumed > rice.total,
    },
    {
      label: "Riso rimanente",
      value: remaining,
      condition: remaining < rice.threshold,
    },
    {
      label: "Fino alla soglia",
      value: remaining - rice.threshold,
      condition: remaining - rice.threshold <= 0,
    },
  ];

  return (
    <>
      {/* <div className="w-full flex justify-end gap-4 text-sm">
        <label className="flex items-center gap-1 cursor-pointer">
          <Checkbox checked={filters.lunch} onCheckedChange={() => toggleFilter("lunch")} />
          Solo pranzo
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <Checkbox checked={filters.dinner} onCheckedChange={() => toggleFilter("dinner")} />
          Solo cena
        </label>
      </div> */}

      <table className={cn("w-[28rem] text-2xl border-collapse")}>
        <tbody>
          {summaryRows.map(({ label, value, condition }, index) => (
            <tr key={index} className="w-full">
              <td className="text-right text-2xl w-[60%]">{label}</td>
              <td className={calculateStyles(condition)}>{formatRice(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
