"use client";

import { VisibilityState } from "@tanstack/react-table";
import getColumns from "./getColumns";
import { useEffect, useState } from "react";
import { Order } from "../../Order";
import getTable from "./getTable";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import OrderCell from "../order/OrderCell";

export default function ToHome({ orders }: { orders: Order[] }) {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    setFilteredOrders(orders.filter((order) => order.type === "TO_HOME"));
  }, []);

  useEffect(() => console.log(filteredOrders), [filteredOrders]);

  const columns = getColumns();
  const table = getTable(
    filteredOrders,
    columns,
    columnVisibility,
    setColumnVisibility
  );

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
                  <OrderCell key={cell.id} cell={cell} />
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
