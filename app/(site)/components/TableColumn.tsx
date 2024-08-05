import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import getNestedValue from "../util/functions/getNestedValue";

type TableColumnProps<T> = {
  sortable?: boolean;
  accessorKey: string;
  headerLabel: string;
  cellContent?: (row: Row<T>) => React.ReactNode;
};

export default function TableColumn<T>({
  sortable = true,
  accessorKey,
  headerLabel,
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
          {headerLabel}
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        headerLabel
      ),
    cell: ({ row }) =>
      cellContent
        ? cellContent(row)
        : String(getNestedValue(row.original, accessorKey)),
  };
}
