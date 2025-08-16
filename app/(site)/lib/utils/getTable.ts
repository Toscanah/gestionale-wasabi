import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import type { TableMeta } from "@tanstack/react-table";

const DEFAULT_PAGE_SIZE = 999999;
const noop = () => {};

interface PaginationEnabled {
  putPagination: true;
  pageSize: number;
}

interface PaginationDisabled {
  putPagination: false;
  pageSize?: never;
}


interface TableProps<T, M extends TableMeta<T> = TableMeta<T>> {
  data: T[];
  columns: ColumnDef<T>[];
  globalFilter?: string;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: Dispatch<SetStateAction<Record<string, boolean>>>;
  pagination?: PaginationEnabled | PaginationDisabled;
  meta?: M;
}

export default function getTable<T, M extends TableMeta<T> = TableMeta<T>>({
  data,
  columns,
  globalFilter = "",
  setGlobalFilter = noop,
  rowSelection = {},
  setRowSelection = noop,
  pagination = { putPagination: false },
  meta
}: TableProps<T, M>): Table<T> {
  return useReactTable({
    data,
    columns,
    meta,
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (_row, index) => String(index),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    autoResetAll: false,
    initialState: {
      pagination: {
        pageSize: pagination.putPagination ? pagination.pageSize : DEFAULT_PAGE_SIZE,
      },
    },
  });
}
