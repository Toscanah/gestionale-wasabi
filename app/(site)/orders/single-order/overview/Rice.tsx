import { cn } from "@/lib/utils";
import formatRice from "../../../functions/formatting-parsing/formatRice";
import { useWasabiContext } from "../../../context/WasabiContext";
import { useEffect, useState } from "react";
import { AnyOrder } from "@/app/(site)/models";
import { debounce } from "lodash";
import { useOrderContext } from "@/app/(site)/context/OrderContext";

export default function Rice() {
  const { order } = useOrderContext();
  const { rice, fetchRemainingRice } = useWasabiContext();
  const [usedRice, setUsedRice] = useState<number>(0);

  useEffect(() => {
    setUsedRice(order.products.reduce((total, product) => total + (product.rice_quantity ?? 0), 0));

    const debouncedFetch = debounce(() => {
      fetchRemainingRice();
    }, 0);
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [order.products]);

  return (
    <div className="w-full flex flex-col overflow-hidden border-foreground">
      <div className="w-full text-center text-2xl border rounded-t-lg bg-foreground text-primary-foreground h-12 p-2">
        RISO
      </div>

      <div className="w-full text-center text-2xl h-12 max-h-12 font-bold border-x flex ">
        <div
          className={cn(
            "w-1/2 border-r p-2 h-12",
            rice.remaining.amount < rice.total.threshold && "text-destructive"
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
            rice.remaining.amount < rice.total.threshold && "text-destructive"
          )}
        >
          {formatRice(rice.remaining.amount)}
        </div>
        <div className="w-1/2 p-2 h-12">{formatRice(usedRice)}</div>
      </div>
    </div>
  );
}
