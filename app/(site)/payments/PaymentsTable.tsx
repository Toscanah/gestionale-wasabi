"use client";

import { Payment } from "@prisma/client";
import { useState } from "react";
import Table from "../components/table/Table";
import getTable from "../util/functions/getTable";
import columns from "./columns";
import useGlobalFilter from "../components/hooks/useGlobalFilter";
import GoBack from "../components/GoBack";
import TableControls from "../components/table/TableControls";
import { PaymentWithOrder } from "../types/PaymentWithOrder";

export default function PaymentsTable({ payments }: { payments: PaymentWithOrder[] }) {
  const [allPayments, setAllPayments] = useState<PaymentWithOrder[]>(payments);
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const table = getTable({ data: allPayments, columns, globalFilter, setGlobalFilter });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] flex-col gap-4">
        <TableControls
          title={<span className="text-2xl h-full flex items-end">Pagamenti</span>}
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />

        <Table table={table} />
      </div>

      <GoBack path="/home" />
    </div>
  );
}
