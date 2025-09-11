"use client";

import { OrderType } from "@prisma/client";
import { endOfDay, isSameDay, startOfDay } from "date-fns";
import React from "react";
import useTable from "../../../hooks/table/useTable";
import Table from "../../../components/table/Table";
import TableControls from "../../../components/table/TableControls";
import WasabiSingleSelect from "../../../components/ui/wasabi/WasabiSingleSelect";
import GoBack from "../../../components/ui/misc/GoBack";
import PaymentsSummary from "./PaymentsSummary";
import PrintSummary from "./PrintSummary";
import columns from "./columns";
import useQueryFilter from "../../../hooks/table/useGlobalFilter";
import usePagination from "@/app/(site)/hooks/table/usePagination";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import usePaymentsHistory from "@/app/(site)/hooks/payments/usePaymentsHistory";
import TablePagination from "@/app/(site)/components/table/TablePagination";
import ShiftFilter from "@/app/(site)/components/ui/filters/select/ShiftFilter";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import OrderTypesFilter from "@/app/(site)/components/ui/filters/select/OrderTypesFilter";
import CalendarFilter from "@/app/(site)/components/ui/filters/calendar/CalendarFilter";
import { debounce } from "lodash";
import ResetFiltersButton from "@/app/(site)/components/ui/filters/common/ResetFiltersButton";

export default function PaymentsTable() {
  const { page, pageSize, setPage, setPageSize } = usePagination({});

  const {
    filteredOrders,
    totalCount,
    isLoading,
    orderTypes,
    setOrderTypes,
    shift,
    setShift,
    period,
    setPeriod,
    handleReset,
    summaryData,
    showReset,
    debouncedQuery,
    inputQuery,
    setInputQuery,
  } = usePaymentsHistory({ page, pageSize });

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: filteredOrders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
    columns,
    pageSize,
  });

  const table = useTable({
    data: tableData,
    columns: tableColumns,
    query: debouncedQuery,
    setQuery: setInputQuery,
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

  const isSummaryEmpty = Object.values(summaryData.totals).every(({ total }) => total === 0);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col gap-4 max-h-[90%]">
        <div className="w-full flex items-center gap-4">
          <span className="font-bold text-xl">Pagamenti</span>

          <SearchBar disabled={isLoading} filter={inputQuery} onChange={setInputQuery} />

          <CalendarFilter
            mode="range"
            defaultValue={{
              from: startOfDay(new Date()),
              to: endOfDay(new Date()),
            }}
            dateFilter={period}
            handleDateFilter={setPeriod}
            disabled={isLoading}
          />

          <ShiftFilter disabled={isLoading} selectedShift={shift} onShiftChange={setShift} />

          <OrderTypesFilter
            selectedTypes={orderTypes}
            onTypesChange={setOrderTypes}
            disabled={isLoading}
          />

          <ResetFiltersButton
            onReset={handleReset}
            className="ml-auto"
            show={!isLoading && showReset}
          />
        </div>

        <Table table={table} tableClassName="max-h-max" cellClassName={() => "h-20 max-h-20"} />

        <TablePagination
          disabled={isLoading}
          table={table}
          page={page}
          pageSize={pageSize}
          pageCount={Math.ceil(totalCount / pageSize)}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalCount={`${totalCount} pagamenti`}
        />

        <div className="mt-auto flex justify-between">
          <PaymentsSummary summaryData={summaryData} disabled={isSummaryEmpty} />
          <PrintSummary summaryData={summaryData} period={period} disabled={isSummaryEmpty} />
        </div>

        <GoBack path="/home" />
      </div>
    </div>
  );
}
