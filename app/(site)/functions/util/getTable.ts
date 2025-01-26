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

const DEFAULT_PAGE_SIZE = 999999;
const noop = () => {};

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  globalFilter?: string;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: Dispatch<SetStateAction<Record<string, boolean>>>;
  pagination?: { putPagination: boolean; pageSize: number };
}

export default function getTable<T>({
  data,
  columns,
  globalFilter = "",
  setGlobalFilter = noop,
  rowSelection = {},
  setRowSelection = noop,
  pagination = { putPagination: false, pageSize: DEFAULT_PAGE_SIZE },
}: TableProps<T>): Table<T> {
  return useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    autoResetPageIndex: false,
    initialState: {
      pagination: {
        pageSize: pagination.putPagination ? pagination.pageSize : DEFAULT_PAGE_SIZE,
      },
    },
  });
}
