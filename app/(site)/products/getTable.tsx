import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ProductWithInfo } from "../types/ProductWithInfo";
import { Dispatch, SetStateAction } from "react";

export default function getTable(
  products: ProductWithInfo[],
  columns: ColumnDef<ProductWithInfo>[],
  globalFilter: string,
  setGlobalFilter: Dispatch<SetStateAction<string>>
) {
  return useReactTable({
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    data: products,
    columns: columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 1234,
      },
    },
  });
}
