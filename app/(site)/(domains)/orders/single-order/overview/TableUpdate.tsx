import { useOrderContext } from "@/context/OrderContext";
import { TableOrder } from "@/lib/shared";
import { toastSuccess } from "@/lib/shared/utils/global/toast";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { useState, useCallback } from "react";
import { PaymentScope } from "@/prisma/generated/client/enums";
import useFocusOnClick from "@/hooks/focus/useFocusOnClick";
import { trpc } from "@/lib/trpc/client";

export default function TableUpdate() {
  const { order: anyOrder, joinTableOrders, updateOrder } = useOrderContext();
  const order = anyOrder as TableOrder;

  const [table, setTable] = useState<string>(order.table_order?.table ?? "");
  const [people, setPeople] = useState<number>(order.table_order?.people ?? 0);
  const [join, setJoin] = useState<string>("");

  const updateTableMutation = trpc.orders.updateTable.useMutation({
    onSuccess: (updatedTableOrder) => {
      updateOrder({
        table_order: { ...order.table_order, table: updatedTableOrder.table_order?.table },
      });
      toastSuccess("Tavolo aggiornato con successo");
    },
  });

  const updatePeopleMutation = trpc.orders.updateTablePpl.useMutation({
    onSuccess: (updatedTableOrder) => {
      updateOrder({
        table_order: { ...order.table_order, people: updatedTableOrder.table_order?.people },
      });
      toastSuccess("Numero di persone aggiornato con successo");
    },
  });

  const debouncedHandleTableChange = useCallback(
    debounce((newTable: string) => {
      if (newTable !== "") {
        updateTableMutation.mutate({ table: newTable, orderId: order.id });
      }
    }, 1000),
    [order.id]
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
      updatePeopleMutation.mutate({ people: newPpl, orderId: order.id });
    }, 1000),
    [order.id]
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

  useFocusOnClick(["table", "people"]);

  return (
    <div className="w-full flex gap-6 items-center">
      <div className="flex-1 flex flex-col space-y-2">
        <span>Tavolo</span>
        <Input
          className="!text-xl h-12"
          id="table"
          disabled={order.payments.some((payment) => payment.scope === PaymentScope.ROMAN)}
          value={table}
          onChange={handleTableInputChange}
        />
      </div>

      <div className="flex-1 flex flex-col space-y-2">
        <span>N° persone</span>
        <Input
          id="people"
          disabled={order.payments.some((payment) => payment.scope === PaymentScope.ROMAN)}
          className="!text-xl h-12"
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
