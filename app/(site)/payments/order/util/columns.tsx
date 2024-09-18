import TableColumn from "@/app/(site)/components/table/TableColumn";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import useGridFocus, { FocussableInput } from "@/app/(site)/components/hooks/useGridFocus";
import { Calc } from "./Calculator";

export default function getColumns(
  handleFieldChange: (key: keyof Calc, value: number, rowIndex: number) => void
): ColumnDef<Calc>[] {
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
            defaultValue={row.original.amount}
            onClick={() => setFocusedInput(focussableInput)}
            //autoFocus={true}
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
      cellContent: (row) => (
        <Input
          type="number"
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
