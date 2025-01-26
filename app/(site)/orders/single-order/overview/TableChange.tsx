import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { TableOrder } from "@/app/(site)/models";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/functions/util/toast";
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

  const debouncedHandleTableJoin = useCallback(
    debounce((tableToJoin: string) => {
      if (tableToJoin !== "") {
        joinTableOrders(tableToJoin);
      }
    }, 1000),
    [joinTableOrders]
  );

  const handleTableInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTable = e.target.value;
    setTable(newTable);
    debouncedHandleTableChange(newTable);
  };

  const handleTableJoinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tableToJoin = e.target.value;
    setJoin(tableToJoin);
    debouncedHandleTableJoin(tableToJoin);
  };

  return (
    <div className="w-full flex gap-6 items-center">
      <div className="w-1/2 flex flex-col space-y-2">
        <span>Tavolo</span>
        <Input className="text-xl h-12" value={table} onChange={handleTableInputChange} />
      </div>

      <div className="w-1/2 flex flex-col space-y-2">
        <span>Unisci tavolo</span>
        <Input value={join} onChange={handleTableJoinInputChange} className="h-12 text-xl" />
      </div>
    </div>
  );
}
