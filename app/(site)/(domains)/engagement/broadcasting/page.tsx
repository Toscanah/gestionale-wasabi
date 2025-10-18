"use client";

import { ArrowRight } from "@phosphor-icons/react";
import columns from "./columns/columns";
import { Button } from "@/components/ui/button";
import EngagementFilter from "./filters/EngagementFilter";
import useEngagement from "../../../hooks/engagement/useEngagement";
import useTable from "../../../hooks/table/useTable";
import Table from "../../../components/table/Table";
import GoBack from "../../../components/ui/misc/GoBack";
import AdminEngagementDialog from "./components/AdminEngagementDialog";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import TablePagination from "@/app/(site)/components/table/TablePagination";
import useTablePagination from "@/app/(site)/hooks/table/useTablePagination";
import CalendarFilter from "@/app/(site)/components/ui/filters/calendar/CalendarFilter";
import TODAY_PERIOD from "@/app/(site)/lib/shared/constants/today-period";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import ResetTableControlsBtn from "@/app/(site)/components/ui/filters/common/ResetTableControlsBtn";
import { toastSuccess } from "@/app/(site)/lib/utils/global/toast";

export default function EngagementPage() {
  const { page, pageSize, setPage, setPageSize } = useTablePagination({ initialPageSize: 50 });

  const {
    activeTypes,
    setActiveTypes,
    leftCustomers,
    rightCustomers,
    isLoading,
    onLeftTableRowClick,
    onRightTableRowClick,
    period,
    setPeriod,
    inputQuery,
    setInputQuery,
    debouncedQuery,
    clearSelectedCustomers,
    totalCount,
    handleReset,
  } = useEngagement({ page, pageSize });

  const { tableColumns, tableData } = useSkeletonTable({
    data: leftCustomers,
    columns,
    isLoading,
  });

  const leftTable = useTable({
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

  const rightTable = useTable({
    data: rightCustomers,
    columns,
  });

  return (
    <div className="h-screen w-screen flex justify-center items-center p-16">
      <div className="min-w-w-[47.5%] w-[47.5%] h-full p-4 flex flex-col gap-4">
        <div className="flex w-full gap-4 items-center">
          <SearchBar disabled={isLoading} query={inputQuery} onChange={setInputQuery} />

          <CalendarFilter
            defaultValue={TODAY_PERIOD}
            title="Intervallo ordini clienti"
            mode="range"
            dateFilter={period}
            handleDateFilter={setPeriod}
            disabled={isLoading}
          />

          <ResetTableControlsBtn
            disabled={isLoading}
            onReset={handleReset}
            hasFilters={!!inputQuery || period !== TODAY_PERIOD}
          />
        </div>

        <Table
          rowClassName={(row) => {
            const base = "h-16 max-h-16";

            if (rightCustomers.some((c) => c.id === row.original.id)) {
              return `${base} bg-muted`;
            }

            return base;
          }}
          table={leftTable}
          tableClassName="max-h-[74vh] h-[74vh]"
          cellClassName={(index) => (index == 3 ? "max-w-60 w-60 truncate" : "")}
          onRowClick={onLeftTableRowClick}
        />

        <TablePagination
          disabled={isLoading}
          table={leftTable}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalCount={totalCount}
        />
      </div>

      <div className="w-[5%] h-full flex flex-col items-center justify-center">
        <ArrowRight size={80} />
      </div>

      <div className="min-w-w-[47.5%] w-[47.5%] h-full p-4 flex flex-col gap-4">
        <EngagementFilter activeTypes={activeTypes} setActiveTypes={setActiveTypes} />

        <Table
          rowClassName={() => "h-16 max-h-16"}
          cellClassName={(index) => (index == 3 ? "max-w-60 w-60 truncate" : "")}
          table={rightTable}
          showNoResult={false}
          tableClassName="max-h-[74vh] h-[74vh]"
          onRowClick={onRightTableRowClick}
        />

        <div className="flex gap-4 w-full items-center justify-center">
          <AdminEngagementDialog
            onSuccess={() => {
              clearSelectedCustomers();
              toastSuccess("Marketing creato con successo");
            }}
            customerIds={rightCustomers.map((c) => c.id)}
            trigger={
              <Button disabled={rightCustomers.length > 0 ? false : true} className="w-full">
                Vai
              </Button>
            }
          />
        </div>
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
