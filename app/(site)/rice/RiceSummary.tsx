import { cn } from "@/lib/utils";
import { useWasabiContext } from "../context/WasabiContext";
import formatRice from "../functions/formatting-parsing/formatRice";

export default function RiceSummary() {
  const { rice } = useWasabiContext();

  const remainingToThreshold = rice.remaining.amount - rice.total.threshold;
  const isZeroOrLess = (value: number) => value <= 0;

  return (
    <table className={cn("w-[28rem] text-2xl border-collapse")}>
      <tbody>
        <tr className="w-full">
          <td className="text-right text-2xl w-[60%]">Riso consumato</td>
          <td
            className={cn(
              "text-right font-bold pl-3",
              rice.total.amount - rice.remaining.amount > rice.total.amount && "text-red-600"
            )}
          >
            {formatRice(rice.total.amount - rice.remaining.amount)}
          </td>
        </tr>

        <tr className="w-full">
          <td className="text-right text-2xl w-[60%]">Riso rimanente</td>
          <td
            className={cn(
              "text-right font-bold pl-3",
              rice.remaining.amount < rice.total.threshold && "text-red-600"
            )}
          >
            {formatRice(rice.remaining.amount)}
          </td>
        </tr>

        <tr className="w-full">
          <td className="text-right text-2xl w-[60%]">Fino alla soglia</td>
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
