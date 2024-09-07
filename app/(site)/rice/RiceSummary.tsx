import { cn } from "@/lib/utils";
import { useWasabiContext } from "../context/WasabiContext";
import formatRice from "../util/functions/formatRice";

export default function RiceSummary() {
  const { rice } = useWasabiContext();

  return (
    <div
      className={cn(
        "flex items-center justify-center text-3xl",
        rice.remaining.amount < rice.remaining.threshold && "text-destructive"
      )}
    >
      Riso rimanente: {formatRice(rice.remaining.amount)}
    </div>
  );
}
