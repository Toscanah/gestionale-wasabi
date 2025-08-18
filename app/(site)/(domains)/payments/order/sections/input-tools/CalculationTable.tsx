import getTable from "@/app/(site)/lib/utils/global/getTable";
import { useState } from "react";
import getColumns from "./columns";
import Table from "@/app/(site)/components/table/Table";
import {
  PaymentCalculation,
  useOrderPaymentContext,
} from "@/app/(site)/context/OrderPaymentContext";

export default function CalculationTable() {
  const { setPaymentCalculations, paymentCalculations, setActiveTool } = useOrderPaymentContext();

  const handleFieldChange = (key: keyof PaymentCalculation, value: number, rowIndex: number) =>
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
        // setActiveTool("manual");
      }

      return updatedCalcs;
    });

  const columns = getColumns(handleFieldChange, setPaymentCalculations);
  const table = getTable({ data: paymentCalculations, columns });

  return (
    <div className="w-full flex max-h-[500px] items-center flex-col gap-4 justify-between">
      <Table table={table} tableClassName="border-none " />
    </div>
  );
}
