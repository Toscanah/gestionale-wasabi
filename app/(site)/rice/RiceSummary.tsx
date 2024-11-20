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
      <p>
        Riso rimanente:{" "}
        <b>{formatRice(rice.remaining.amount)}</b>
      </p>
    </div>
  );
}
