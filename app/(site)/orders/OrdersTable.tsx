"use client";

import {
  Table as TanstackTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getColumns from "./getColumns";
import { TypesOfOrder } from "../types/TypesOfOrder";
import getTable from "./getTable";
import { flexRender } from "@tanstack/react-table";
import { AnyOrder } from "../types/OrderType";
import Order from "./order/Order";

type TableProps = {
  type: TypesOfOrder;
  data: AnyOrder[];
};

export default function OrdersTable({ type, data }: TableProps) {
  const columns = getColumns(type);
  const table = getTable(data, columns);

  const formatAddress = (index: number) => {
    if (index == 2 && type == TypesOfOrder.TO_HOME) {
      return "flex w-full max-h-16 h-16 max-w-64 line-clamp-2 items-center p-1";
    } else return "";
  };

  return (
    <div className="w-full h-full">
      <div className="rounded-md border w-full overflow-y-auto max-h-[90%] h-[90%]">
        <TanstackTable>
          <TableHeader className="sticky top-0 z-30 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:cursor-pointer w-full h-16 text-xl"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <Order
                      key={cell.id}
                      cell={cell}
                      className={formatAddress(index)}
                    />
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nessun ordine!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TanstackTable>
      </div>
    </div>
  );
}
