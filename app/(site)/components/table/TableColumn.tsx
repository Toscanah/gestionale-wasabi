import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { ReactNode } from "react";
import getNestedValue from "../../util/functions/getNestedValue";

type TableColumnProps<T> = {
  sortable?: boolean;
  accessorKey: string;
  header: string | ReactNode;
  cellContent?: (row: Row<T>) => ReactNode;
};

export default function TableColumn<T>({
  sortable = true,
  accessorKey,
  header,
  cellContent,
}: TableColumnProps<T>): ColumnDef<T> {
  return {
    accessorKey,
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
      cellContent ? cellContent(row) : String(getNestedValue(row.original, accessorKey)),

  };
}
