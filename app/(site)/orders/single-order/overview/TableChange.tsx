import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { TableOrder } from "@/app/(site)/models";
import fetchRequest from "@/app/(site)/util/functions/fetchRequest";
import { toastSuccess } from "@/app/(site)/util/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useState, useCallback } from "react";

export default function TableChange() {
  const { order: anyOrder, joinTableOrders, updateOrder } = useOrderContext();
  const order = anyOrder as TableOrder;

  const [table, setTable] = useState<string>(order.table_order?.table ?? "");
  const [join, setJoin] = useState<string>("");

  const debouncedHandleTableChange = useCallback(
    debounce((newTable: string) => {
      if (newTable !== "") {
        fetchRequest<TableOrder>("POST", "/api/orders", "updateTable", {
          table: newTable,
          orderId: order.id,
        }).then(() => {
          updateOrder({ table_order: { table: newTable } });
          toastSuccess("Tavolo aggiornato con successo");
        });
      }
    }, 1000),
    []
  );

  const handleTableInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTable = e.target.value;
    setTable(newTable);
    debouncedHandleTableChange(newTable);
  };

  const handleTableJoin = () => {
    if (join !== "") {
      joinTableOrders(join);
    }
  };

  return (
    <div className="w-full flex gap-2 items-center">
      <div className="w-1/2 flex flex-col space-y-2">
        <span>Tavolo</span>
        <Input className="text-xl" value={table} onChange={handleTableInputChange} />
      </div>

      <div className="w-1/2 flex flex-col space-y-2">
        <span>Unisci</span>
        <div className="flex gap-2 items-center">
          <Input value={join} onChange={(e) => setJoin(e.target.value)} />
          <Button onClick={handleTableJoin}>UNISCI</Button>
        </div>
      </div>
    </div>
  );
}
