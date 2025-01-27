import { cn } from "@/lib/utils";
import { useWasabiContext } from "../context/WasabiContext";
import formatRice from "../functions/formatting-parsing/formatRice";

export default function RiceSummary() {
  const { rice } = useWasabiContext();

  const calculateStyles = (condition: boolean) =>
    cn("text-right font-bold pl-3", condition && "text-red-600");

  const summaryRows = [
    {
      label: "Riso consumato",
      value: rice.total - rice.remaining,
      condition: rice.total - rice.remaining > rice.total,
    },
    {
      label: "Riso rimanente",
      value: rice.remaining,
      condition: rice.remaining < rice.threshold,
    },
    {
      label: "Fino alla soglia",
      value: rice.remaining - rice.threshold,
      condition: rice.remaining - rice.threshold <= 0,
    },
  ];

  return (
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
  );
}
