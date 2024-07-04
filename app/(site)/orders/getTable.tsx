import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { OrderType } from "../types/OrderType";

export default function getTable(data: OrderType[], columns: ColumnDef<OrderType>[]) {
  return useReactTable({
    getFilteredRowModel: getFilteredRowModel(),
    data: data,
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
