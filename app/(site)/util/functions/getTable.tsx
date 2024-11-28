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

const PAGE_SIZE = 99999;
const noop = () => {};

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  globalFilter?: string;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export default function getTable<T>({
  data,
  columns,
  globalFilter = "",
  setGlobalFilter = noop,
  rowSelection = {},
  setRowSelection = noop,
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
        pageSize: PAGE_SIZE,
      },
    },
  });
}
