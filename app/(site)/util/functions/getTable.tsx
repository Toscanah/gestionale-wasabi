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

export default function getTable<T>({
  data,
  columns,
  globalFilter,
  setGlobalFilter,
  rowSelection,
  setRowSelection,
}: {
  data: T[];
  columns: ColumnDef<any>[];
  globalFilter?: string;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
  rowSelection?: any;
  setRowSelection?: Dispatch<SetStateAction<any>>;
}): Table<T> {
  return useReactTable({
    data,
    columns,
    state: {
      globalFilter: globalFilter || "",
      rowSelection: rowSelection || {},
    },
    onGlobalFilterChange: setGlobalFilter || (() => {}),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection || (() => {}),
    autoResetPageIndex: false,
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
      },
    },
  });
}
