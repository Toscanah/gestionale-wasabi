"use client";

import { isSameDay } from "date-fns";
import { OrderType } from "@prisma/client";
import getTable from "../../functions/util/getTable";
import Table from "../../components/table/Table";
import TableControls from "../../components/table/TableControls";
import Calendar from "../../components/ui/calendar/Calendar";
import SelectWrapper from "../../components/ui/select/SelectWrapper";
import GoBack from "../../components/ui/misc/GoBack";
import DailySummary from "./DailySummary";
import PrintSummary from "./PrintSummary";
import columns from "./columns";
import RandomSpinner from "../../components/ui/misc/RandomSpinner";
import usePaymentsHistory from "../../hooks/usePaymentsHistory";
import useGlobalFilter from "../../hooks/useGlobalFilter";
import ShiftFilterSelector from "../../components/filters/shift/ShiftFilterSelector";

export default function PaymentsTable() {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const {
    filteredOrders,
    isLoading,
    allOrders,
    date,
    resetFilters,
    setDate,
    setTypeFilter,
    typeFilter,
    shiftFilter,
    setShiftFilter,
  } = usePaymentsHistory();

  const table = getTable({
    data: filteredOrders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    columns,
    globalFilter,
    setGlobalFilter,
  });

  const OrderTypeSelector = () => (
    <SelectWrapper
      disabled={isLoading}
      className="h-10 max-w-sm"
      groups={[
        {
          items: [
            { name: "Tutti i tipi di ordine", value: "all" },
            { name: "Tavolo", value: OrderType.TABLE },
            { name: "Domicilio", value: OrderType.HOME },
            { name: "Asporto", value: OrderType.PICKUP },
          ],
        },
      ]}
      value={typeFilter}
      defaultValue="all"
      onValueChange={setTypeFilter}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col gap-4 max-h-[90%]">
        <TableControls
          title={<span className="text-2xl h-full flex items-end">Pagamenti</span>}
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onReset={resetFilters}
          resetDisabled={isLoading}
          searchBarDisabled={isLoading}
        >
          <ShiftFilterSelector
            disabled={isLoading}
            shiftFilter={shiftFilter}
            onShiftChange={setShiftFilter}
          />

          <OrderTypeSelector />

          <Calendar
            mode="single"
            dateFilter={date}
            handleDateFilter={setDate}
            disabled={isLoading}
          />
        </TableControls>

        {isLoading ? <RandomSpinner isLoading={isLoading} /> : <Table table={table} />}

        <div className="mt-auto flex justify-between">
          <DailySummary orders={filteredOrders} />
          <PrintSummary
            orders={
              date
                ? allOrders.filter((order) => isSameDay(new Date(order.created_at), date))
                : allOrders
            }
          />
        </div>
      </div>

      <GoBack path="/home" />
    </div>
  );
}
