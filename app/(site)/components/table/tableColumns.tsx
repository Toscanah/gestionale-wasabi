import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef, ColumnMeta, Row, SortingFnOption, TableMeta } from "@tanstack/react-table";
import { Fragment, ReactNode } from "react";
import getNestedValue from "../../lib/utils/global/getNestedValue";
import { uniqueId } from "lodash";
import joinItemsWithComma, { JoinItemType } from "../../lib/utils/global/string/joinItemsWithComma";
import { Checkbox } from "@/components/ui/checkbox";

// -----------------------------------------------------------------------------
// Types & Utilities
// -----------------------------------------------------------------------------

type Primitive = string | number | boolean | Date | null | undefined;

export type BaseColumnProps = {
  header?: ReactNode;
  sortable?: boolean;
  skeleton?: ReactNode;
  meta?: ColumnMeta<any, any>;
};

export type ColumnDefWithSkeleton<T> = ColumnDef<T> & {
  skeleton?: ReactNode;
};

const JOIN_HEADERS: Record<JoinItemType, string> = {
  addresses: "Indirizzi",
  doorbells: "Campanelli",
  categories: "Categorie",
  options: "Opzioni",
};

function isLoading(meta: TableMeta<any> | undefined): boolean {
  return Boolean(meta?.isLoading);
}

function buildHeader<T>(title: ReactNode = "", sort: boolean): ColumnDef<T>["header"] {
  return ({ column }) =>
    sort ? (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {title}
        <ArrowsDownUp className="ml-2 h-4 w-4" />
      </Button>
    ) : (
      <>{title}</>
    );
}

// -----------------------------------------------------------------------------
// 1. IndexColumn
// -----------------------------------------------------------------------------

type IndexColumnProps = Omit<BaseColumnProps, "sortable">;

export function IndexColumn<T>({
  header = "#",
  skeleton,
}: IndexColumnProps): ColumnDefWithSkeleton<T> {
  return {
    id: typeof header === "string" ? header : "#",
    header: buildHeader<T>(header, false),
    cell: ({ row, table }) => {
      const isLoad = isLoading(table.options.meta);
      if (isLoad && skeleton) return skeleton;

      // Grab pagination state
      const { pageIndex, pageSize } = table.getState().pagination ?? { pageIndex: 0, pageSize: 0 };

      // Detect pagination mode
      const paginationMode = table.options.meta?.paginationMode ?? "client";

      // ✅ Server mode: add offset for global numbering
      if (paginationMode === "server") {
        return pageIndex * pageSize + (row.index + 1);
      }

      // ✅ Client mode: use current sorted position
      const sortedIndex =
        table.getSortedRowModel()?.flatRows?.findIndex((r) => r.id === row.id) ?? 0;
      return sortedIndex + 1;
    },
    enableSorting: false,
  };
}

// -----------------------------------------------------------------------------
// 2. FieldColumn
// -----------------------------------------------------------------------------

type FieldColumnProps<T> = BaseColumnProps & {
  key: string;
};

export function FieldColumn<T>({
  key,
  header,
  sortable = true,
  skeleton,
  meta,
}: FieldColumnProps<T>): ColumnDefWithSkeleton<T> {
  return {
    id: key,
    meta: {
      ...meta,
      label: typeof header === "string" ? header : meta?.label,
    },
    accessorFn: (original) => getNestedValue<T>(original, key),
    header: buildHeader<T>(header, sortable),
    sortingFn: "alphanumeric",
    cell: ({ getValue, table }) => {
      const isLoad = isLoading(table.options.meta);
      if (isLoad && skeleton) return skeleton;

      return <>{String(getValue() ?? "")}</>;
    },
    enableSorting: sortable,
  };
}

// -----------------------------------------------------------------------------
// 3. JoinColumn
// -----------------------------------------------------------------------------

type JoinOptions = {
  key: JoinItemType;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

type JoinColumnProps = BaseColumnProps & {
  options: JoinOptions;
};

export function JoinColumn<T>({
  options,
  header,
  sortable = true,
  skeleton,
}: JoinColumnProps): ColumnDefWithSkeleton<T> {
  return {
    meta: {
      label: typeof header === "string" ? header : options.key,
    },
    id: options.key,
    accessorFn: (original) => joinItemsWithComma(original, options.key),
    header: buildHeader(header ?? JOIN_HEADERS[options.key], sortable),
    sortingFn: "alphanumeric",
    cell: ({ row, table }) => {
      const isLoad = isLoading(table.options.meta);
      if (isLoad && skeleton) return skeleton;

      const Wrapper = options.wrapper || Fragment;
      return <Wrapper>{joinItemsWithComma(row.original, options.key)}</Wrapper>;
    },
    enableSorting: sortable,
  };
}

// -----------------------------------------------------------------------------
// 4. ValueColumn
// -----------------------------------------------------------------------------

type ValueColumnProps<T> = BaseColumnProps & {
  value: (row: Row<T>, meta: TableMeta<T> | undefined) => ReactNode;
  accessor: (row: T) => Primitive;
  sortingFn?: SortingFnOption<T>;
};

export function ValueColumn<T>({
  accessor,
  value,
  header,
  sortable = true,
  sortingFn = "alphanumeric",
  skeleton,
}: ValueColumnProps<T>): ColumnDefWithSkeleton<T> {
  if (typeof header === "string" && header.trim() === "") {
    throw new Error("ValueColumn: 'header' must be a non-empty string.");
  }

  const col: ColumnDefWithSkeleton<T> = {
    meta: {
      label: typeof header === "string" ? header : undefined,
    },
    id: typeof header === "string" ? header : header !== undefined ? uniqueId("col_") : uniqueId(),
    accessorFn: (original) => accessor(original),
    header: buildHeader<T>(header, sortable),
    cell: ({ row, table }) => {
      const isLoad = isLoading(table.options.meta);

      if (isLoad && skeleton) return skeleton;

      return value(row, table.options.meta);
    },
    enableSorting: sortable,
  };

  if (sortable) col.sortingFn = sortingFn;
  return col;
}

// -----------------------------------------------------------------------------
// 5. ActionColumn
// -----------------------------------------------------------------------------

type ActionColumnProps<T> = Omit<BaseColumnProps, "sortable"> & {
  action: (row: Row<T>, meta: TableMeta<T> | undefined) => ReactNode;
};

export function ActionColumn<T>({
  action,
  header,
  skeleton,
  meta,
}: ActionColumnProps<T>): ColumnDefWithSkeleton<T> {
  return {
    meta: {
      ...meta,
      label: typeof header === "string" ? header : undefined,
    },
    id: typeof header === "string" && header.trim() !== "" ? header : uniqueId("action_col_"),
    header: buildHeader(header, false),
    // ⬇️ allow appearing in visibility dropdown
    accessorFn: (row: T) => row, // dummy accessor to pass filter
    enableHiding: true,

    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row, table }) => {
      const isLoad = isLoading(table.options.meta);
      if (isLoad && skeleton) return skeleton;

      return action(row, table.options.meta);
    },
  };
}

// -----------------------------------------------------------------------------
// 6. HybridColumn (alias of ValueColumn)
// -----------------------------------------------------------------------------

export const HybridColumn = ValueColumn;

// -----------------------------------------------------------------------------
// 7. SelectColumn
// -----------------------------------------------------------------------------

export function SelectColumn<T>(): ColumnDefWithSkeleton<T> {
  return {
    id: "select_" + uniqueId(),
    header: ({ table }) => {
      // const isLoad = isLoading(table.options.meta);
      // if (isLoad) return <div className="h-5 w-5 rounded bg-muted" />;

      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row, table }) => {
      // const isLoad = isLoading(table.options.meta);
      // if (isLoad) return <div className="h-5 w-5 rounded bg-muted" />;

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
    size: 32,
    enableSorting: false,
    enableHiding: false,
  };
}
