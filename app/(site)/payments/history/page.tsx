"use client";

import { format, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import getTable from "../../functions/util/getTable";
import columns from "./columns";
import useGlobalFilter from "../../hooks/useGlobalFilter";
import GoBack from "../../components/ui/GoBack";
import TableControls from "../../components/table/TableControls";
import { OrderWithPayments } from "@/app/(site)/models";
import SelectWrapper from "../../components/ui/select/SelectWrapper";
import DailySummary from "./DailySummary";
import { OrderType } from "@prisma/client";
import fetchRequest from "../../functions/api/fetchRequest";
import PrintSummary from "./PrintSummary";
import { it } from "date-fns/locale";
import Calendar from "../../components/ui/calendar/Calendar";

export default function PaymentsTable() {
  const [allOrders, setAllOrders] = useState<OrderWithPayments[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithPayments[]>([]);
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const [typeFilter, setTypeFilter] = useState<string>("-1");
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
        return isSameDay(orderDate, date);
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
    setTypeFilter(value);
  };

  const resetFilters = () => {
    setDate(new Date());
    setFilteredOrders(allOrders);
    setTypeFilter("-1");
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
            value={typeFilter}
            defaultValue="-1"
            onValueChange={handleTypeFilter}
          />

          <Calendar mode="single" dateFilter={date} handleDateFilter={setDate} />
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
