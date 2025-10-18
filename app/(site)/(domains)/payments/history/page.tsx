"use client";

import { endOfDay, startOfDay } from "date-fns";
import useTable from "../../../hooks/table/useTable";
import Table from "../../../components/table/Table";
import GoBack from "../../../components/ui/misc/GoBack";
import PaymentsSummary from "./PaymentsSummary";
import PrintSummary from "./PrintSummary";
import columns from "./columns";
import useTablePagination from "@/app/(site)/hooks/table/useTablePagination";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import usePaymentsHistory from "@/app/(site)/hooks/payments/usePaymentsHistory";
import TablePagination from "@/app/(site)/components/table/TablePagination";
import ShiftFilter from "@/app/(site)/components/ui/filters/select/ShiftFilter";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import OrderTypesFilter from "@/app/(site)/components/ui/filters/select/OrderTypesFilter";
import CalendarFilter from "@/app/(site)/components/ui/filters/calendar/CalendarFilter";
import ResetTableControlsBtn from "@/app/(site)/components/ui/filters/common/ResetTableControlsBtn";
import { Button } from "@/components/ui/button";

export default function PaymentsTable() {
  const { page, pageSize, setPage, setPageSize } = useTablePagination();

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
      page,
      setPage,
      setPageSize,
      totalCount,
    },
  });

  const isSummaryEmpty = Object.values(summaryData.totals).every(({ total }) => total === 0);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col justify-center gap-4 max-h-[90%]">
        <div className="w-full flex items-center gap-4">
          <span className="font-bold text-xl">Pagamenti</span>

          <SearchBar disabled={isLoading} query={inputQuery} onChange={setInputQuery} />

          <CalendarFilter
            mode="range"
            defaultValue={{
              from: startOfDay(new Date()),
              to: endOfDay(new Date()),
            }}
            useYears
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

          <div className="ml-auto flex items-center gap-2">
            <ResetTableControlsBtn
              onReset={handleReset}
              className="ml-auto"
              disabled={isLoading}
              hasFilters={showReset}
            />

            <Button variant={"outline"} disabled>
              TODO: Ordinamento
            </Button>
          </div>
        </div>

        <Table table={table} maxRows={10} scrollAdjustment={1} />

        <TablePagination
          label="Pagamenti"
          disabled={isLoading}
          table={table}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalCount={totalCount}
        >
          <div className="flex justify-between gap-4">
            <PaymentsSummary summaryData={summaryData} disabled={isSummaryEmpty || isLoading} />
            <PrintSummary
              summaryData={summaryData}
              period={period}
              disabled={isSummaryEmpty || isLoading}
            />
          </div>
        </TablePagination>

        <GoBack path="/home" />
      </div>
    </div>
  );
}
