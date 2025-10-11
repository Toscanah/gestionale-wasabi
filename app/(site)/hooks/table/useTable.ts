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
import { MAX_RECORDS } from "../../lib/shared";

const DEFAULT_PAGE_SIZE = MAX_RECORDS;
const noop = () => {};

interface ClientPagination {
  mode: "client";
  pageSize?: number;
}

interface ServerPagination {
  mode: "server";
  pageSize: number;
  setPageSize: (size: number) => void;
  page: number;
  setPage: (page: number) => void;
  totalCount: number;
}

type TablePagination = ClientPagination | ServerPagination | undefined;

interface TableProps<T, M extends TableMeta<T> = TableMeta<T>> {
  data: T[];
  columns: ColumnDef<T>[];
  query?: string;
  setQuery?: Dispatch<SetStateAction<string>>;
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
              pageIndex: pagination.page,
              pageSize: pagination.pageSize,
            },
          }
        : {}),
    },
    onGlobalFilterChange: setQuery,
    getRowId: (_row: any, index: number) => String(index),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: true,
    autoResetAll: false,
  };

  if (pagination?.mode === "server") {
    const { pageSize, setPageSize, page, setPage, totalCount } = pagination;

    return useReactTable({
      ...commonConfig,
      manualPagination: true,
      pageCount: Math.ceil((totalCount || 0) / pageSize),
      onPaginationChange: (updater) => {
        const newState =
          typeof updater === "function" ? updater({ pageIndex: page, pageSize }) : updater;

        setPage(newState.pageIndex);
        setPageSize(newState.pageSize);
      },
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
