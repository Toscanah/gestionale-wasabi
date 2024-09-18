import getTable from "@/app/(site)/util/functions/getTable";
import { useState } from "react";
import getColumns from "./columns";
import Table from "@/app/(site)/components/table/Table";

export type Calc = { amount: number; quantity: number; total: number };

export default function CalculationTable() {
  const [calcs, setCalcs] = useState<Calc[]>([{ amount: 0, quantity: 0, total: 0 }]);

  const handleFieldChange = (key: keyof Calc, value: number, rowIndex: number) => {
    setCalcs((prevCalcs) => {
      const updatedCalcs = [...prevCalcs];
      const row = updatedCalcs[rowIndex];

      if (key === "amount" || key === "quantity") {
        row[key] = value;
        row.total = row.amount * row.quantity;
      }

      updatedCalcs[rowIndex] = row;
      if (row.amount > 0 && row.quantity > 0 && rowIndex === updatedCalcs.length - 1) {
        updatedCalcs.push({ amount: 0, quantity: 0, total: 0 });
      }
      return updatedCalcs;
    });
  };

  const columns = getColumns(handleFieldChange);
  const table = getTable({ data: calcs, columns });

  return <Table table={table} tableClassName="border-none" />;
}
