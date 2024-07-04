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
import Order from "../../orders/order/Order";
import { Button } from "@/components/ui/button";
import { Gear, Plus } from "@phosphor-icons/react";
import AddressDialog from "../../customer/AddressDialog";

export default function ToHome({ orders }: { orders: OrderType[] }) {
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>(orders);

  useEffect(() => {
    setFilteredOrders(orders.filter((order) => order.type === "TO_HOME"));
  }, []);

  const handleUpdatedOrder = (updatedOrder: OrderType) => {
    setFilteredOrders((prevOrders) => {
      // l'id di un ordine può anche essere 45806, e non posso usarlo come index nell'array
      // devo trovare effettivamente l'index di dove sta quell'ordine
      const newOrders = [...prevOrders];
      newOrders[prevOrders.findIndex((order) => order.id === updatedOrder.id)] =
        updatedOrder;
      return newOrders;
    });
  };

  const createOrder = () => {
    fetch("api/orders/", {
      body: JSON.stringify({
        requestType: "create",
        content: {
          type: "TO_HOME",
        },
      }),
    })
      .then((response) => response.json())
      .then((order) => {
        setFilteredOrders((prevValues) => {
          return [...prevValues, order];
        });
      });
  };

  const columns = getColumns();
  const table = getTable(filteredOrders, columns);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <AddressDialog/>

        
      </div>
      <div className="rounded-md border max-h-full overflow-y-auto">
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
                  key={row.original.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:cursor-pointer h-12 text-2xl"
                >
                  {row.getVisibleCells().map((cell) => (
                    <Order
                      key={cell.id}
                      cell={cell}
                      handleUpdatedOrder={handleUpdatedOrder}
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
        </Table>
      </div>
    </div>
  );
}
