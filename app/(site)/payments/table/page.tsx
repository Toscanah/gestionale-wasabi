"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import getTable from "../../util/functions/getTable";
import columns from "./columns";
import useGlobalFilter from "../../components/hooks/useGlobalFilter";
import GoBack from "../../components/GoBack";
import TableControls from "../../components/table/TableControls";
import { OrderWithPayments } from "@/app/(site)/models";
import SelectWrapper from "../../components/select/SelectWrapper";
import DailySummary from "./DailySummary";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { OrderType } from "@prisma/client";
import fetchRequest from "../../util/functions/fetchRequest";
import PrintSummary from "./PrintSummary";

export default function PaymentsTable() {
  const [allOrders, setAllOrders] = useState<OrderWithPayments[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithPayments[]>([]);
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    fetchRequest<OrderWithPayments[]>("GET", "/api/payments", "getOrdersWithPayments").then(
      (ordersWithPayments) => {
        setAllOrders(ordersWithPayments);
        setFilteredOrders(ordersWithPayments);
      }
    );
  }, []);

  useEffect(() => {
    if (date) {
      const filtered = allOrders.filter((order) => {
        const orderDate = new Date(order.created_at);

        return (
          orderDate.getFullYear() === date.getFullYear() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getDate() === date.getDate()
        );
      });
      setFilteredOrders(filtered);
    }
  }, [date, allOrders]);

  const handleTypeFilter = (value: string) => {
    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.created_at);

      const matchesDate =
        !date ||
        (orderDate.getFullYear() === date.getFullYear() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getDate() === date.getDate());

      const matchesType = value === "-1" || order.type === value;

      return matchesDate && matchesType;
    });
    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setDate(new Date());
    setFilteredOrders(allOrders);
  };

  const table = getTable({
    data: filteredOrders.sort(
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
          onReset={resetFilters}
        >
          <SelectWrapper
            className="h-10 max-w-sm"
            groups={[
              {
                items: [
                  { name: "Tutti i tipi di ordine", value: "-1" },
                  { name: "Tavolo", value: OrderType.TABLE },
                  { name: "Domicilio", value: OrderType.HOME },
                  { name: "Asporto", value: OrderType.PICKUP },
                ],
              },
            ]}
            defaultValue="-1"
            onValueChange={handleTypeFilter}
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

        <div className="mt-auto flex justify-between">
          <DailySummary orders={filteredOrders} />
          <PrintSummary
            orders={
              date
                ? allOrders.filter((order) => {
                    const orderDate = new Date(order.created_at);

                    return (
                      orderDate.getFullYear() === date.getFullYear() &&
                      orderDate.getMonth() === date.getMonth() &&
                      orderDate.getDate() === date.getDate()
                    );
                  })
                : allOrders
            }
          />
        </div>
      </div>

      <GoBack path="/home" />
    </div>
  );
}
