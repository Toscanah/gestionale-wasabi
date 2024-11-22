"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import getTable from "../../util/functions/getTable";
import columns from "../table/columns";
import useGlobalFilter from "../../components/hooks/useGlobalFilter";
import GoBack from "../../components/GoBack";
import TableControls from "../../components/table/TableControls";
import { OrderWithPayments } from "../../types/OrderWithPayments";
import SelectWrapper from "../../components/select/SelectWrapper";
import DailySummary from "./DailySummary";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

export default function PaymentsTable({ fetchedOrders }: { fetchedOrders: OrderWithPayments[] }) {
  const [orders, setOrders] = useState<OrderWithPayments[]>(fetchedOrders);
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (date) {
      setOrders(() =>
        fetchedOrders.filter((order) => {
          const orderDate = new Date(order.created_at);

          return (
            orderDate.getFullYear() === date.getFullYear() &&
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getDate() === date.getDate()
          );
        })
      );
    }
  }, [date]);

  const table = getTable({
    data: orders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    columns,
    globalFilter,
    setGlobalFilter,
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] flex-col gap-4">
        <TableControls
          title={<span className="text-2xl h-full flex items-end">Pagamenti</span>}
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onReset={() => {
            setDate(new Date());
            setOrders(fetchedOrders);
          }}
        >
          <SelectWrapper
            className="h-10 max-w-sm"
            groups={[
              {
                items: [
                  { name: "Tutti i tipi di ordine", value: "-1" },
                  { name: "Tavolo", value: "TABLE" },
                  { name: "Domicilio", value: "TO_HOME" },
                  { name: "Asporto", value: "PICK_UP" },
                ],
              },
            ]}
            defaultValue="-1"
            onValueChange={(value) =>
              setOrders(() =>
                fetchedOrders.filter((order) => {
                  const orderDate = new Date(order.created_at);

                  const matchesDate =
                    orderDate.getFullYear() === date?.getFullYear() &&
                    orderDate.getMonth() === date?.getMonth() &&
                    orderDate.getDate() === date?.getDate();

                  const matchesType = value === "-1" || order.type === value;

                  return matchesDate && matchesType;
                })
              )
            }
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "grow justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Seleziona una data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </TableControls>

        <Table table={table} />

        <DailySummary orders={orders} />
      </div>

      <GoBack path="/home" />
    </div>
  );
}
