import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef, Row, SortingFnOption, TableMeta } from "@tanstack/react-table";
import { Fragment, ReactNode } from "react";
import getNestedValue from "../../lib/utils/global/getNestedValue";
import { uniqueId } from "lodash";
import joinItemsWithComma, { JoinItemType } from "../../lib/utils/global/string/joinItemsWithComma";
import { Checkbox } from "@/components/ui/checkbox";

type Primitive = string | number | boolean | Date | null | undefined;

/**
 * Primitive types allowed in table columns.
 */
type JoinOptions = {
  key: JoinItemType;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

const JOIN_HEADERS: Record<JoinItemType, string> = {
  addresses: "Indirizzi",
  doorbells: "Campanelli",
  categories: "Categorie",
  options: "Opzioni",
};

/**
 * Builds a table column header with optional sorting button.
 * @param title - The column title.
 * @param sort - Whether the column is sortable.
 */
function buildHeader<T>(title: ReactNode = "", sort: boolean): ColumnDef<T>["header"] {
  return ({ column }) =>
    sort ? (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {title}
        <ArrowsDownUp className="ml-2 h-4 w-4" />
      </Button>
    ) : (
      String(title)
    );
}

/**
 * Base props for all table columns.
 * @property header - The column header label.
 * @property sortable - Whether the column is sortable.
 */
export type BaseColumnProps = {
  header?: ReactNode;
  sortable?: boolean;
};

/* ------------------------------------------------------
 *  1. IndexColumn
 * ---------------------------------------------------- */
type IndexColumn = BaseColumnProps;

/**
 * Returns a column definition for a row index column (auto-incrementing number).
 * @param header - The column header label (default: "#").
 * @param sortable - Whether the column is sortable (default: true).
 */
export function IndexColumn<T>({ header = "#", sortable = true }: IndexColumn): ColumnDef<T> {
  return {
    id: typeof header === "string" ? header : "#",
    header: buildHeader<T>(header, sortable),
    cell: ({ row, table }) =>
      (table.getSortedRowModel()?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) ?? 0) + 1,
  };
}

/* ------------------------------------------------------
 *  2. FieldColumn
 * ---------------------------------------------------- */
type FieldColumn = BaseColumnProps & {
  key: string;
};

/**
 * Returns a column definition for a field value (simple accessor).
 * @param key - The key of the field to display.
 * @param header - The column header label.
 * @param sortable - Whether the column is sortable (default: true).
 */
export function FieldColumn<T>({ key, header, sortable = true }: FieldColumn): ColumnDef<T> {
  return {
    id: key,
    accessorFn: (original) => getNestedValue<T>(original, key),
    header: buildHeader<T>(header, sortable),
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => <>{String(getValue())}</>, // reuse accessorFn output
  };
}

/* ------------------------------------------------------
 *  3. JoinColumn
 * ---------------------------------------------------- */
type JoinColumn = BaseColumnProps & {
  options: JoinOptions;
};

/**
 * Returns a column definition for joining array fields into a single cell.
 * @param options - Join options for the array field.
 * @param header - The column header label.
 * @param sortable - Whether the column is sortable (default: true).
 */
export function JoinColumn<T>({ options, header, sortable = true }: JoinColumn): ColumnDef<T> {
  return {
    id: options.key,
    accessorFn: (original) => joinItemsWithComma(original, options.key),
    header: buildHeader(header ?? JOIN_HEADERS[options.key], sortable),
    sortingFn: "alphanumeric",
    cell: ({ row }) => {
      const Wrapper = options.wrapper || Fragment;
      return <Wrapper>{joinItemsWithComma(row.original, options.key)}</Wrapper>;
    },
  };
}

/* ------------------------------------------------------
 *  4. ValueColumn (sortable/filterable, accessor required)
 * ---------------------------------------------------- */
type ValueColumn<T> = BaseColumnProps & {
  value: (row: Row<T>, meta: TableMeta<T> | undefined) => ReactNode;
  accessor: (row: T) => Primitive;
  sortingFn?: SortingFnOption<T>;
};

/**
 * Returns a column definition for a value column with custom rendering and accessor.
 * @param accessor - Function to access the value from the row data.
 * @param value - Function to render the cell value.
 * @param header - The column header label.
 * @param sortable - Whether the column is sortable (default: true).
 * @param sortingFn - Function to filter the column values.
 */
export function ValueColumn<T>({
  accessor,
  value,
  header,
  sortable = true,
  sortingFn = "alphanumeric",
}: ValueColumn<T>): ColumnDef<T> {
  if (typeof header === "string" && header.trim() === "") {
    throw new Error("ValueColumn: 'header' must be a non-empty string.");
  }

  const col: ColumnDef<T> = {
    id: typeof header === "string" ? header : header !== undefined ? String(header) : uniqueId(),
    accessorFn: (original) => accessor(original),
    header: buildHeader<T>(header, sortable),
    cell: ({ row, table }) => value(row, table.options.meta),
    enableSorting: sortable,
  };

  if (sortable) {
    // Pass through either the string key or the custom function
    col.sortingFn = sortingFn;
  }

  return col;
}

/* ------------------------------------------------------
 *  5. ActionColumn (pure actions, no accessor/sorting/filtering)
 * ---------------------------------------------------- */
type ActionColumn<T> = Pick<BaseColumnProps, "header"> & {
  action: (row: Row<T>, meta: TableMeta<T> | undefined) => ReactNode;
};

/**
 * Returns a column definition for an action column (e.g., buttons, icons).
 * @param action - Function to render the action cell content.
 * @param header - The column header label.
 */
export function ActionColumn<T>({ action, header }: ActionColumn<T>): ColumnDef<T> {
  return {
    id: typeof header === "string" && header.trim() !== "" ? header : uniqueId(),
    header: buildHeader(header, false),
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row, table }) => action(row, table.options.meta),
  };
}

/* ------------------------------------------------------
 *  5. HybridColumn (hybrid, same as ValueColumn)
 * ---------------------------------------------------- */
export const HybridColumn = ValueColumn;

/**
 * HybridColumn is an alias for ValueColumn, supporting both accessor and custom rendering.
 */

// type SelectColumn<T> = {
//   action: (row: Row<T>, meta: TableMeta<T> | undefined) => ReactNode;
// };

export function SelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 32,
    enableSorting: false,
    enableHiding: false,
  };
}
