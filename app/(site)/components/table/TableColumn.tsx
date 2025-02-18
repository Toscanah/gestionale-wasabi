import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef, FilterFnOption, filterFns, Row } from "@tanstack/react-table";
import { ReactNode } from "react";
import getNestedValue from "../../functions/util/getNestedValue";

type TableColumnProps<T> = {
  sortable?: boolean;
  accessorKey: string;
  header: ReactNode;
  cellContent?: (row: Row<T>) => ReactNode;
  accessorFn?: (row: T) => unknown;
};

export default function TableColumn<T>({
  sortable = true,
  accessorKey,
  header,
  cellContent,
  accessorFn,
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
    cell: ({ row }) =>
      cellContent ? cellContent(row) : String(getNestedValue<T>(row.original, accessorKey)),
    filterFn: "includesString",
  };
}
