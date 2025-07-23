import { cn } from "@/lib/utils";
import formatRice from "../../../../lib/formatting-parsing/formatRice";
import { useWasabiContext } from "../../../../context/WasabiContext";
import { useEffect, useState } from "react";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import getPioRice from "@/app/(site)/lib/services/product-management/getPioRice";

export default function Rice() {
  const { order } = useOrderContext();
  const { rice, updateRemainingRice } = useWasabiContext();
  const [usedRice, setUsedRice] = useState<number>(0);

  useEffect(() => {
    const currentUsedRice = order.products.reduce(
      (total, product) => total + getPioRice(product),
      0
    );

    setUsedRice(currentUsedRice);
    updateRemainingRice();
    // updateRemainingRice(currentUsedRice);
  }, [order.products]);

  const adjustedRemaining = rice.remainingLunch + rice.remainingDinner - rice.total;

  return (
    <div className="w-full flex flex-col overflow-hidden border-foreground">
      <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12 p-2">
        RISO
      </div>

      <div className="w-full text-center text-2xl h-12 max-h-12 font-bold border-x flex ">
        <div
          className={cn(
            "w-1/2 border-r p-2 h-12",
            adjustedRemaining < rice.threshold && "text-destructive"
          )}
        >
          Rimanente
        </div>
        <div className="w-1/2 p-2 h-12">Ordine</div>
      </div>

      <div className="w-full text-center text-2xl h-12 border flex max-h-12 rounded-b-lg">
        <div
          className={cn(
            "w-1/2 border-r p-2 h-12",
            adjustedRemaining < rice.threshold && "text-destructive"
          )}
        >
          {formatRice(adjustedRemaining)}
        </div>
        <div className="w-1/2 p-2 h-12">{formatRice(usedRice)}</div>
      </div>
    </div>
  );
}
