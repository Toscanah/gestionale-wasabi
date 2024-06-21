"use client";

import { VisibilityState } from "@tanstack/react-table";
import getColumns from "./getColumns";
import { useEffect, useState } from "react";
import { OrderType } from "../../types/OrderType";
import getTable from "./getTable";
import { flexRender } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Order from "../order/Order";

export default function ToHome({ orders }: { orders: OrderType[] }) {
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>(orders);

  useEffect(() => {
    setFilteredOrders(orders.filter((order) => order.type === "TO_HOME"));
  }, []);

  const columns = getColumns();
  const table = getTable(filteredOrders, columns);

  return (
    <div className="rounded-md border max-h-full overflow-y-scroll">
      <Table>
        <TableHeader className="sticky top-0 z-30 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={cn({
                    "text-right": index === headerGroup.headers.length - 1,
                  })}
                >
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
                className="hover:cursor-pointer h-12 text-2xl"
              >
                {row.getVisibleCells().map((cell) => (
                  <Order key={cell.id} cell={cell} />
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
