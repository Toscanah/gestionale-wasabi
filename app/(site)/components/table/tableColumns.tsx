import { Button } from "@/components/ui/button";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { ColumnDef, Row, TableMeta } from "@tanstack/react-table";
import { Fragment, ReactNode } from "react";
import getNestedValue from "../../lib/utils/getNestedValue";
import joinItemsWithComma, {
  JoinItemType,
} from "@/app/(site)/lib/formatting-parsing/joinItemsWithComma";
import { uniqueId } from "lodash";

type Primitive = string | number | boolean | Date | null | undefined;

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

function buildHeader<T>(title: string = "", sort: boolean): ColumnDef<T>["header"] {
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

type BaseProps = {
  header?: string;
  sort?: boolean;
};

/* ------------------------------------------------------
 *  1. IndexColumn
 * ---------------------------------------------------- */
type IndexColumn = BaseProps;

export function IndexColumn<T>({ header = "#", sort = true }: IndexColumn): ColumnDef<T> {
  return {
    id: header,
    header: buildHeader<T>(header, sort),
    cell: ({ row, table }) =>
      (table.getSortedRowModel()?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) ?? 0) + 1,
  };
}

/* ------------------------------------------------------
 *  2. FieldColumn
 * ---------------------------------------------------- */
type FieldColumn = BaseProps & {
  key: string;
};

export function FieldColumn<T>({ key, header, sort = true }: FieldColumn): ColumnDef<T> {
  return {
    id: key,
    accessorFn: (original) => getNestedValue<T>(original, key),
    header: buildHeader<T>(header, sort),
    sortingFn: "alphanumeric",
    cell: ({ getValue }) => <>{String(getValue())}</>, // reuse accessorFn output
  };
}

/* ------------------------------------------------------
 *  3. JoinColumn
 * ---------------------------------------------------- */
type JoinColumn = BaseProps & {
  options: JoinOptions;
};

export function JoinColumn<T>({ options, header, sort = true }: JoinColumn): ColumnDef<T> {
  return {
    id: options.key,
    accessorFn: (original) => joinItemsWithComma(original, options.key),
    header: buildHeader(header ?? JOIN_HEADERS[options.key], sort),
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
type ValueColumn<T> = BaseProps & {
  value: (row: Row<T>, meta: TableMeta<T> | undefined) => ReactNode;
  accessor: (row: T) => Primitive;
};

export function ValueColumn<T>({
  accessor,
  value,
  header,
  sort = true,
}: ValueColumn<T>): ColumnDef<T> {
  return {
    id: header ?? uniqueId(),
    accessorFn: (original) => accessor(original),
    header: buildHeader(header, sort),
    sortingFn: "alphanumeric",
    cell: ({ row, table }) => value(row, table.options.meta),
  };
}

/* ------------------------------------------------------
 *  5. ActionColumn (pure actions, no accessor/sorting/filtering)
 * ---------------------------------------------------- */
type ActionColumn<T> = Pick<BaseProps, "header"> & {
  action: (row: Row<T>, meta: TableMeta<T> | undefined) => ReactNode;
};

export function ActionColumn<T>({ action, header }: ActionColumn<T>): ColumnDef<T> {
  return {
    id: header ?? uniqueId(),
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
