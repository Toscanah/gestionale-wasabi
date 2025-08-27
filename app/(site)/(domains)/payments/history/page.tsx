"use client";

import { OrderType } from "@prisma/client";
import { isSameDay } from "date-fns";
import React from "react";
import useTable from "../../../hooks/table/useTable";
import Table from "../../../components/table/Table";
import TableControls from "../../../components/table/TableControls";
import CalendarFilter from "../../../components/ui/filters/calendar/CalendarFilter";
import WasabiSingleSelect from "../../../components/ui/select/WasabiSingleSelect";
import GoBack from "../../../components/ui/misc/GoBack";
import PaymentsSummary from "./PaymentsSummary";
import PrintSummary from "./PrintSummary";
import columns from "./columns";
import useGlobalFilter from "../../../hooks/table/useGlobalFilter";
import usePagination from "@/app/(site)/hooks/table/usePagination";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import ShiftFilterSelector from "../../../components/filters/shift/ShiftFilterSelector";
import usePaymentsHistory from "@/app/(site)/hooks/payments/usePaymentsHistory";
import TablePagination from "@/app/(site)/components/table/TablePagination";

export default function PaymentsTable() {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const { page, pageSize, setPage, setPageSize, resetPagination } = usePagination({});

  const {
    orders,
    totalCount,
    isLoading,
    typeFilter,
    setTypeFilter,
    shiftFilter,
    setShiftFilter,
    timeScope,
    setTimeScope,
    singleDate,
    setSingleDate,
    rangeDate,
    setRangeDate,
    handleReset,
    summaryData,
  } = usePaymentsHistory({ page, pageSize });

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: orders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    columns,
    pageSize,
  });

  const table = useTable({
    data: tableData,
    columns: tableColumns,
    globalFilter,
    setGlobalFilter,
    pagination: {
      mode: "server",
      pageSize,
      pageIndex: page,
      pageCount: Math.ceil((totalCount || 0) / pageSize),
      onPaginationChange: (updater) => {
        const newState =
          typeof updater === "function" ? updater({ pageIndex: page, pageSize }) : updater;

        setPage(newState.pageIndex);
        setPageSize(newState.pageSize);
      },
    },
  });

  const OrderTypeSelector = () => (
    <WasabiSingleSelect
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
      onValueChange={(newType) => setTypeFilter(newType as OrderType | "all")}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col gap-4 max-h-[90%]">
        <TableControls
          title={<span className="text-2xl h-full flex items-end">Pagamenti</span>}
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={(filter) => {
            setGlobalFilter(filter);
            // table.setPageIndex(0);
          }}
          onReset={() => {
            handleReset();
            resetPagination();
          }}
          resetDisabled={isLoading}
          searchBarDisabled={isLoading}
        >
          <ShiftFilterSelector
            disabled={isLoading}
            shiftFilter={shiftFilter}
            onShiftChange={setShiftFilter}
          />

          <OrderTypeSelector />

          <WasabiSingleSelect
            className="h-10"
            value={timeScope}
            disabled={isLoading}
            onValueChange={(newScope) => setTimeScope(newScope as any)}
            groups={[
              {
                items: [
                  { name: "Giorno specifico", value: "single" },
                  { name: "Arco temporale", value: "range" },
                ],
              },
            ]}
          />

          {timeScope === "single" ? (
            <CalendarFilter
              mode="single"
              dateFilter={singleDate}
              handleDateFilter={setSingleDate}
              disabled={isLoading}
            />
          ) : (
            <CalendarFilter
              mode="range"
              dateFilter={rangeDate}
              handleDateFilter={setRangeDate}
              disabled={isLoading}
            />
          )}
        </TableControls>

        <Table table={table} tableClassName="max-h-max" cellClassName={() => "h-20 max-h-20"} />

        <TablePagination
          table={table}
          page={page}
          pageSize={pageSize}
          pageCount={Math.ceil(totalCount / pageSize)}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalCount={`${totalCount} pagamenti`}
        />

        <div className="mt-auto flex justify-between">
          <PaymentsSummary summaryData={summaryData} />
          <PrintSummary
            summaryData={summaryData}
            firstOrderDate={
              (singleDate
                ? orders.filter((order) => isSameDay(new Date(order.created_at), singleDate))
                : orders)[0]?.created_at
            }
          />
        </div>

        <GoBack path="/home" />
      </div>
    </div>
  );
}
