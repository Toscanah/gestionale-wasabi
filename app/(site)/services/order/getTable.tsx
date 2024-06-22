import { Product, ProductsOnOrder } from "@prisma/client";
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
import { ProductsInOrderType } from "../../types/ProductsInOrderType";

export default function getTable(
  products: ProductsInOrderType[],
  columns: ColumnDef<ProductsInOrderType>[]
) {
  
  return useReactTable({
    getFilteredRowModel: getFilteredRowModel(),
    data: products,
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
