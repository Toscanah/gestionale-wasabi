import TableColumn from "@/app/(site)/components/table/TableColumn";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Calc } from "./CalculationTable";
import useGridFocus, { FocussableInput } from "@/app/(site)/components/hooks/useGridFocus";

export default function getColumns(
  handleFieldChange: (key: keyof Calc, value: number, rowIndex: number) => void
): ColumnDef<Calc>[] {
  const { getInputRef, addInputRef, setFocusedInput, handleKeyNavigation, focusedInput } =
    useGridFocus({ rowIndex: 0, colIndex: 0 }, 1);

  return [
    TableColumn({
      accessorKey: "amount",
      header: "Ammontare",
      cellContent: (row) => (
        <Input
          type="number"
          defaultValue={row.original.amount}
          onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 0 })}
          autoFocus={true}
          ref={(ref) => addInputRef(ref, { rowIndex: row.index, colIndex: 0 })}
          onKeyDown={(e: any) => {
            handleKeyNavigation(e, { rowIndex: row.index, colIndex: 0 });
            if (e.key === "Enter") {
              handleFieldChange("amount", parseFloat(e.target.value), row.index);
            }
          }}
        />
      ),
    }),

    TableColumn({
      accessorKey: "quantity",
      header: "Quantità",
      cellContent: (row) => (
        <Input
          type="number"
          //autoFocus={focusedInput.rowIndex === row.index && focusedInput.colIndex === 1}
          onClick={() => setFocusedInput({ rowIndex: row.index, colIndex: 1 })}
          ref={(ref) => addInputRef(ref, { rowIndex: row.index, colIndex: 1 })}
          defaultValue={row.original.quantity}
          onKeyDown={(e: any) => {
            handleKeyNavigation(e, { rowIndex: row.index, colIndex: 1 });
            if (e.key === "Enter") {
              handleFieldChange("quantity", parseFloat(e.target.value), row.index);
            }
          }}
        />
      ),
    }),

    TableColumn({
      accessorKey: "total",
      header: "Totale",
      cellContent: (row) => <span>{row.original.total.toFixed(2)}</span>,
    }),
  ];
}
