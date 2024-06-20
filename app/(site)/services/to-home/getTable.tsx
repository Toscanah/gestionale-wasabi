import {
  ColumnDef,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { Order } from "../../Order";

export default function getTable(
  orders: Order[],
  columns: ColumnDef<Order>[],
  columnVisibility: VisibilityState,
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
) {
  return useReactTable({
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    data: orders,
    columns: columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 1234,
      },
    },
  });
}
