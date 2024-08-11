import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import formatRice from "../../util/functions/formatRice";
import { useWasabiContext } from "../../context/WasabiContext";
import { Table } from "@tanstack/react-table";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import { useEffect, useState } from "react";
import { AnyOrder } from "../../types/PrismaOrders";

export default function OrderSummary({
  order,
  table,
  deleteRows,
}: {
  order: AnyOrder;
  table: Table<ProductInOrderType>;
  deleteRows: (table: Table<ProductInOrderType>) => void;
}) {
  const { rice } = useWasabiContext();
  const [usedRice, setUsedRice] = useState<number>(0);

  useEffect(() => {
    setUsedRice(
      order.products.reduce((total, product) => total + product.product.rice * product.quantity, 0)
    );
  }, [order.products]);

  return (
    <div className="w-[20%] flex flex-col gap-6 h-full">
      <Button
        className="w-full h-12 text-xl"
        variant={"destructive"}
        onClick={() => deleteRows(table)}
        disabled={table.getFilteredSelectedRowModel().rows.length == 0}
      >
        Cancella prodotti selezionati
      </Button>

      <Button className="w-full h-12 text-xl" variant={"destructive"} onClick={() => {}}>
        Elimina ordine
      </Button>

      <div className="mt-auto flex flex-col gap-6">
        <div className="w-full flex flex-col overflow-hidden border-foreground">
          <div className="w-full text-center text-2xl border rounded-t bg-foreground text-primary-foreground h-12 p-2">
            RISO
          </div>

          <div className="w-full text-center text-2xl h-12 max-h-12 font-bold border-x flex ">
            <div
              className={cn(
                "w-1/2 border-r p-2 h-12",
                rice.amount - usedRice < rice.threshold && "text-destructive"
              )}
            >
              Rimanente
            </div>
            <div className="w-1/2 p-2 h-12">Ordine</div>
          </div>

          <div className="w-full text-center text-2xl h-12 border flex max-h-12">
            <div
              className={cn(
                "w-1/2 border-r p-2 h-12",
                rice.amount - usedRice < rice.threshold && "text-destructive"
              )}
            >
              {formatRice(rice.amount - usedRice)}
            </div>
            <div className="w-1/2 p-2 h-12">{formatRice(usedRice)}</div>
          </div>
        </div>

        <div className="w-full flex flex-col  *:p-2 overflow-hidden border-foreground">
          <div className="w-full text-center text-2xl border rounded-t bg-foreground text-primary-foreground h-12">
            TOTALE
          </div>
          <div className="w-full text-center text-2xl h-12 font-bold border-x border-b rounded-b ">
            € {order.total}
          </div>
        </div>

        <div className="flex gap-6">
          <Button className="w-full text-3xl h-24">Dividi</Button>
          <Button className="w-full text-3xl h-24">Stampa</Button>
        </div>

        {/* bg-[#4BB543] */}
        <Button className="w-full text-3xl h-24 ">PAGA</Button>
      </div>
    </div>
  );
}
