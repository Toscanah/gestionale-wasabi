import { cn } from "@/lib/utils";
import { useWasabiContext } from "../context/WasabiContext";
import formatRice from "../functions/formatting-parsing/formatRice";

export default function RiceSummary() {
  const { rice } = useWasabiContext();

  const remainingToThreshold = rice.remaining.amount - rice.remaining.threshold;
  const isZeroOrLess = (value: number) => value <= 0;

  return (
    <table
      className={cn(
        "w-[28rem] text-3xl border-collapse",
        rice.remaining.amount < rice.remaining.threshold && "text-destructive"
      )}
    >
      <tbody>
        <tr className="w-full">
          <td className="text-right text-2xl w-[70%]">Corrente</td>
          <td
            className={cn(
              "text-right font-bold pl-3",
              isZeroOrLess(rice.remaining.amount) && "text-red-600"
            )}
          >
            {formatRice(rice.remaining.amount)}
          </td>
        </tr>
        <tr className="w-full">
          <td className="text-right text-2xl w-[70%]">Fino alla soglia</td>
          <td
            className={cn(
              "text-right font-bold pl-3",
              isZeroOrLess(remainingToThreshold) && "text-red-600"
            )}
          >
            {formatRice(remainingToThreshold)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
