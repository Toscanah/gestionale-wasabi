import { cn } from "@/lib/utils";
import { useWasabiContext } from "../context/WasabiContext";
import formatRice from "../util/functions/formatRice";

export default function RiceSummary() {
  const { rice } = useWasabiContext();

  return (
    <span
      className={cn(
        "flex items-center text-3xl w-96 justify-end ",
        rice.remaining.amount < rice.remaining.threshold && "text-destructive"
      )}
    >
      Riso rimanente: {formatRice(rice.remaining.amount)}
    </span>
  );
}
