import TableColumn from "@/app/(site)/components/table/TableColumn";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import useGridFocus from "@/app/(site)/components/hooks/useGridFocus";
import formatAmount from "@/app/(site)/util/functions/formatAmount";
import { PaymentCalculation } from "@/app/(site)/context/OrderPaymentContext";
import { X } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";

export default function getColumns(
  handleFieldChange: (key: keyof PaymentCalculation, value: number, rowIndex: number) => void,
  setPaymentCalculations: Dispatch<SetStateAction<PaymentCalculation[]>>
): ColumnDef<PaymentCalculation>[] {
  const { addInputRef, setFocusedInput, handleKeyNavigation } = useGridFocus(
    { rowIndex: 0, colIndex: 0 },
    1
  );

  return [
    TableColumn({
      accessorKey: "amount",
      header: "Ammontare",
      cellContent: (row) => {
        const focussableInput = { rowIndex: row.index, colIndex: 0 };

        return (
          <Input
            type="number"
            autoFocus={row.original.total == 0}
            defaultValue={row.original.amount}
            onClick={() => setFocusedInput(focussableInput)}
            ref={(ref) => addInputRef(ref, focussableInput)}
            onKeyDown={(e: any) => {
              handleKeyNavigation(e, focussableInput);
              if (e.key === "Enter") {
                handleFieldChange("amount", parseFloat(e.target.value), row.index);
              }
            }}
          />
        );
      },
    }),

    TableColumn({
      accessorKey: "quantity",
      header: "Quantità",
      cellContent: (row) => {
        const focussableInput = { rowIndex: row.index, colIndex: 1 };

        return (
          <Input
            type="number"
            onClick={() => setFocusedInput(focussableInput)}
            ref={(ref) => addInputRef(ref, focussableInput)}
            defaultValue={row.original.quantity}
            onKeyDown={(e: any) => {
              handleKeyNavigation(e, focussableInput);
              if (e.key === "Enter") {
                handleFieldChange("quantity", parseFloat(e.target.value), row.index);
              }
            }}
          />
        );
      },
    }),

    TableColumn({
      accessorKey: "total",
      header: "Totale",
      cellContent: (row) => <span>{formatAmount(row.original.total)}</span>,
    }),

    TableColumn({
      accessorKey: "remove",
      header: "",
      sortable: false,
      cellContent: (row) =>
        row.original.total !== 0 && (
          <X
            size={24}
            className="hover:cursor-pointer"
            onClick={() =>
              setPaymentCalculations((prevCalculations) =>
                prevCalculations.filter((_, index) => index !== row.index)
              )
            }
          />
        ),
    }),
  ];
}
