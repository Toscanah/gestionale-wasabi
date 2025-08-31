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

interface ClientPagination {
  mode: "client";
  pageSize?: number;
}

interface ServerPagination {
  mode: "server";
  pageSize: number;
  pageIndex: number;
  pageCount: number;
  onPaginationChange: (updater: any) => void;
}

type TablePagination = ClientPagination | ServerPagination | undefined;

interface TableProps<T, M extends TableMeta<T> = TableMeta<T>> {
  data: T[];
  columns: ColumnDef<T>[];
  query?: string; // 👈 debounced query
  setQuery?: Dispatch<SetStateAction<string>>; // 👈 updates raw inputQuery
  rowSelection?: Record<string, boolean>;
  setRowSelection?: Dispatch<SetStateAction<Record<string, boolean>>>;
  pagination?: TablePagination;
  meta?: M;
}

export default function useTable<T, M extends TableMeta<T> = TableMeta<T>>({
  data,
  columns,
  query = "",
  setQuery = noop,
  rowSelection = {},
  setRowSelection = noop,
  pagination,
  meta,
}: TableProps<T, M>): Table<T> {
  const commonConfig: Parameters<typeof useReactTable<T>>[0] = {
    data,
    columns,
    meta,
    state: {
      globalFilter: query,
      rowSelection,
      ...(pagination && pagination.mode === "server"
        ? {
            pagination: {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            },
          }
        : {}),
    },
    onGlobalFilterChange: setQuery,
    getRowId: (_row: any, index: number) => String(index),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    autoResetAll: false,
  };

  if (pagination?.mode === "server") {
    return useReactTable({
      ...commonConfig,
      manualPagination: true,
      pageCount: pagination.pageCount,
      onPaginationChange: pagination.onPaginationChange,
    });
  }

  if (pagination?.mode === "client") {
    return useReactTable({
      ...commonConfig,
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      initialState: {
        pagination: { pageSize: pagination.pageSize || DEFAULT_PAGE_SIZE, pageIndex: 0 },
      },
    });
  }

  return useReactTable({
    ...commonConfig,
    initialState: {
      pagination: { pageSize: DEFAULT_PAGE_SIZE, pageIndex: 0 },
    },
  });
}
