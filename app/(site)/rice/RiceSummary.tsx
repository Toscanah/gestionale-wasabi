import { cn } from "@/lib/utils";
import { useWasabiContext } from "../orders/WasabiContext";
import formatRice from "../util/functions/formatRice";

export default function RiceSummary() {
  const { rice } = useWasabiContext();

  return (
    <div className={cn("flex items-center justify-center text-3xl", rice < 100 && "text-destructive")}>
      Riso rimanente: {formatRice(rice)}
    </div>
  );
}
