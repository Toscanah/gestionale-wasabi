import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { TableOrder } from "@shared";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { toastSuccess } from "@/app/(site)/lib/util/toast";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useState, useCallback } from "react";
import { PaymentScope } from "@prisma/client";

export default function TableUpdate() {
  const { order: anyOrder, joinTableOrders, updateOrder } = useOrderContext();
  const order = anyOrder as TableOrder;

  const [table, setTable] = useState<string>(order.table_order?.table ?? "");
  const [people, setPeople] = useState<number>(order.table_order?.people ?? 0);
  const [join, setJoin] = useState<string>("");

  const debouncedHandleTableChange = useCallback(
    debounce((newTable: string) => {
      if (newTable !== "") {
        fetchRequest<TableOrder>("PATCH", "/api/orders", "updateTable", {
          table: newTable,
          orderId: order.id,
        }).then(() => {
          updateOrder({ table_order: { ...order.table_order, table: newTable } });
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

  const debouncedHandlePplChange = useCallback(
    debounce((newPpl: number) => {
      fetchRequest<TableOrder>("PATCH", "/api/orders", "updateTablePpl", {
        people: newPpl,
        orderId: order.id,
      }).then(() => {
        updateOrder({ table_order: { ...order.table_order, people: newPpl } });
        toastSuccess("Numero di persone aggiornato con successo");
      });
    }, 1000),
    []
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

  const handlePplUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPpl = e.target.valueAsNumber;
    if (isNaN(newPpl) || newPpl < 0) {
      return;
    }
    setPeople(newPpl);
    debouncedHandlePplChange(newPpl);
  };

  return (
    <div className="w-full flex gap-6 items-center">
      <div className="w-full flex flex-col space-y-2">
        <span>Tavolo</span>
        <Input className="text-xl h-12" value={table} onChange={handleTableInputChange} />
      </div>

      <div className="w-full flex flex-col space-y-2">
        <span>N° persone</span>
        <Input
          disabled={order.payments.some((payment) => payment.scope === PaymentScope.ROMAN)}
          className="text-xl h-12"
          type="number"
          value={people}
          onChange={handlePplUpdate}
        />
      </div>

      {/* <div className="w-full flex flex-col space-y-2">
        <span>Unisci tavolo</span>
        <Input value={join} onChange={handleTableJoinInputChange} className="h-12 text-xl" />
      </div> */}
    </div>
  );
}
