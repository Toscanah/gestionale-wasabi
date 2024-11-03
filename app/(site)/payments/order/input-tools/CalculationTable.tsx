import getTable from "@/app/(site)/util/functions/getTable";
import { useState } from "react";
import getColumns from "./columns";
import Table from "@/app/(site)/components/table/Table";

export type PaymentCalculation = { amount: number; quantity: number; total: number };

export default function CalculationTable() {
  const [paymentCalculations, setPaymentCalculations] = useState<PaymentCalculation[]>([
    { amount: 0, quantity: 0, total: 0 },
  ]);

  const handleFieldChange = (key: keyof PaymentCalculation, value: number, rowIndex: number) => {
    setPaymentCalculations((prevCalcs) => {
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
  const table = getTable({ data: paymentCalculations, columns });

  return (
    <div className="w-full h-full flex items-center flex-col gap-4 justify-between">
      <div className="flex">
        <Table table={table} tableClassName="border-none" />
      </div>
    </div>
  );
}
