"use client";

import { useState } from "react";
import Table from "../../components/table/Table";
import getTable from "../../util/functions/getTable";
import columns from "../table/columns";
import useGlobalFilter from "../../components/hooks/useGlobalFilter";
import GoBack from "../../components/GoBack";
import TableControls from "../../components/table/TableControls";
import { OrderWithPayments } from "../../types/OrderWithPayments";
import SelectWrapper from "../../components/select/SelectWrapper";

export default function PaymentsTable({ fetchedOrders }: { fetchedOrders: OrderWithPayments[] }) {
  const [orders, setOrders] = useState<OrderWithPayments[]>(fetchedOrders);
  const [globalFilter, setGlobalFilter] = useGlobalFilter();

  const table = getTable({
    data: orders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    columns,
    globalFilter,
    setGlobalFilter,
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] flex-col gap-4">
        <TableControls
          title={<span className="text-2xl h-full flex items-end">Pagamenti</span>}
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onReset={() => setOrders(fetchedOrders)}
        >
          <SelectWrapper
            className="h-10 max-w-sm"
            groups={[
              {
                items: [
                  { name: "Tutti i tipi di ordine", value: "-1" },
                  { name: "Tavolo", value: "TABLE" },
                  { name: "Domicilio", value: "TO_HOME" },
                  { name: "Asporto", value: "PICK_UP" },
                ],
              },
            ]}
            defaultValue="-1"
            onValueChange={(value) =>
              setOrders(
                value === "-1"
                  ? fetchedOrders
                  : fetchedOrders.filter((order) => order.type === value)
              )
            }
          />
        </TableControls>

        <Table table={table} />
      </div>

      <GoBack path="/home" />
    </div>
  );
}
