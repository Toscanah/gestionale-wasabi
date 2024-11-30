import { cn } from "@/lib/utils";
import { useWasabiContext } from "../context/WasabiContext";
import formatRice from "../util/functions/formatRice";

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
        <tr>
          <td className="text-right">Corrente</td>
          <td
            className={cn(
              "text-right font-bold",
              isZeroOrLess(rice.remaining.amount) && "text-red-600"
            )}
          >
            {formatRice(rice.remaining.amount)}
          </td>
        </tr>
        <tr>
          <td className="text-right">Fino alla soglia</td>
          <td
            className={cn(
              "text-right font-bold",
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
