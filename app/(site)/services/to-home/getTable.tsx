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
import { OrderType } from "../../types/OrderType";

export default function getTable(
  orders: OrderType[],
  columns: ColumnDef<OrderType>[]
) {
  return useReactTable({
    getFilteredRowModel: getFilteredRowModel(),
    data: orders,
    columns: columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 1234,
      },
    },
  });
}
