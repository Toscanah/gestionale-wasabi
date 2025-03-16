import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Fragment, ReactNode } from "react";
import getNestedValue from "../../functions/util/getNestedValue";
import joinItemsWithComma, {
  JoinItemType,
} from "@/app/(site)/functions/formatting-parsing/joinItemsWithComma";
import { uniqueId } from "lodash";

type JoinOptions = {
  key: JoinItemType;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

type TableColumnProps<T> = {
  sortable?: boolean;
  isRowIndex?: boolean;
} & (
  | { accessorKey: string; cellContent?: never; joinOptions?: never; header: string }
  | {
      cellContent: (row: Row<T>) => ReactNode;
      accessorKey?: never;
      joinOptions?: never;
      header: string;
    }
  | { joinOptions: JoinOptions; accessorKey?: never; cellContent?: never; header?: string }
);

const HEADERS: Record<JoinItemType, string> = {
  addresses: "Indirizzi",
  doorbells: "Campanelli",
  categories: "Categorie",
  options: "Opzioni",
};

export default function TableColumn<T>({
  sortable = true,
  accessorKey,
  header,
  cellContent,
  isRowIndex = false,
  joinOptions,
}: TableColumnProps<T>): ColumnDef<T> {
  const computedHeader = header || (joinOptions ? HEADERS[joinOptions.key] || joinOptions.key : "");

  return {
    id: String(
      accessorKey || (joinOptions ? joinOptions.key : header.length !== 0 ? header : uniqueId())
    ),

    ...(joinOptions
      ? {
          accessorFn: (original) => joinItemsWithComma(original, joinOptions.key),
          sortingFn: "alphanumeric",
        }
      : accessorKey
      ? {
          accessorFn: (original) => getNestedValue<T>(original, accessorKey),
          sortingFn: "alphanumeric",
        }
      : cellContent
      ? {
          accessorFn: (original) => {
            try {
              // Extracting the raw value from the row
              const content = cellContent({ original } as Row<T>);
              return typeof content === "string" ? content : String(content);
            } catch {
              return "";
            }
          },
          sortingFn: "alphanumeric",
        }
      : {}),

    header: ({ column }) =>
      sortable ? (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {computedHeader}
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        String(computedHeader)
      ),

    cell: (cellContext) => {
      const { row } = cellContext;

      if (isRowIndex) {
        const { table } = cellContext;
        return (
          (table.getSortedRowModel()?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) ||
            0) + 1
        );
      }

      // Handle different cases for value extraction
      const value = joinOptions
        ? joinItemsWithComma(row.original, joinOptions.key)
        : accessorKey
        ? getNestedValue<T>(row.original, accessorKey)
        : "";

      const Wrapper = joinOptions?.wrapper || Fragment;

      return cellContent ? cellContent(row) : <Wrapper>{String(value)}</Wrapper>;
    },

    filterFn: "includesString",
    enableSorting: sortable,
  };
}
