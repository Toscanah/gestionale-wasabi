import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { ProductInOrderType } from "../../types/ProductInOrderType";


export default function getTable(
  products: ProductInOrderType[],
  columns: ColumnDef<ProductInOrderType>[],
  rowSelection: any,
  setRowSelection: Dispatch<SetStateAction<any>>
) {
  return useReactTable({
    getFilteredRowModel: getFilteredRowModel(),
    data: products,
    columns: columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 1234,
      },
    },
  });
}
