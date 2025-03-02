import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ReactNode } from "react";
import getNestedValue from "../../functions/util/getNestedValue";

type TableColumnProps<T> = {
  sortable?: boolean;
  accessorKey: string;
  header: ReactNode;
  cellContent?: (row: Row<T>) => ReactNode;
  accessorFn?: (row: T) => unknown;
  /**
   * When true, the cell will display the 1-indexed row position based on the
   * current sorted model.
   */
  isRowIndex?: boolean;
};

export default function TableColumn<T>({
  sortable = true,
  accessorKey,
  header,
  cellContent,
  accessorFn,
  isRowIndex = false,
}: TableColumnProps<T>): ColumnDef<T> {
  return {
    accessorKey,
    accessorFn,
    header: ({ column }) =>
      sortable ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {header}
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        header
      ),
    cell: (cellContext) => {
      if (isRowIndex) {
        const { row, table } = cellContext;

        return (
          (table.getSortedRowModel()?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) ||
            0) + 1
        );
      }
      return cellContent
        ? cellContent(cellContext.row)
        : String(getNestedValue<T>(cellContext.row.original, accessorKey));
    },
    filterFn: "includesString",
  };
}
