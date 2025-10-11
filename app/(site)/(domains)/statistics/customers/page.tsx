"use client";

import useTable from "../../../hooks/table/useTable";
import Table from "../../../components/table/Table";
import columns from "./columns";
import GoBack from "../../../components/ui/misc/GoBack";
import CalendarFilter from "../../../components/ui/filters/calendar/CalendarFilter";
import { RFMRankRule } from "@/app/(site)/lib/shared/types/RFM";
import { useTheme } from "next-themes";
import useCustomersStats from "@/app/(site)/hooks/statistics/useCustomersStats";
import TablePagination from "@/app/(site)/components/table/TablePagination";
import useTablePagination from "@/app/(site)/hooks/table/useTablePagination";
import React, { useEffect } from "react";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import ResetTableControlsBtn from "@/app/(site)/components/ui/filters/common/ResetTableControlsBtn";
import RanksFilter from "@/app/(site)/components/ui/filters/select/RanksFilter";
import SortingMenu from "@/app/(site)/components/ui/sorting/SortingMenu";
import CustomerOriginsFilter from "@/app/(site)/components/ui/filters/select/CustomerOriginsFilter";
import { Separator } from "@/components/ui/separator";

export type CustomerStatsTableMeta = {
  ranks: RFMRankRule[];
  theme: string;
};

export default function CustomersStats() {
  const { page, pageSize, setPage, setPageSize } = useTablePagination({ initialPageSize: 10 });
  const {
    customers,
    totalCount,
    isLoading,
    period,
    ranks,
    setRanks,
    setPeriod,
    debouncedQuery,
    inputQuery,
    setInputQuery,
    handleReset,
    allRanks,
    rfmRanks,
    sortingFields,
    activeSorts,
    setActiveSorts,
    customerOrigins,
    setCustomerOrigins,
  } = useCustomersStats({ page, pageSize });
  const { theme } = useTheme();

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: customers,
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
    meta: {
      ranks: rfmRanks,
      theme: theme ?? "light",
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col justify-center max-h-[90%] gap-4">
        <div className="w-full flex items-center gap-4">
          <SearchBar disabled={isLoading} query={inputQuery} onChange={setInputQuery} />

          <CalendarFilter
            usePresets
            disabled={isLoading}
            dateFilter={period}
            mode="range"
            handleDateFilter={setPeriod}
          />

          <CustomerOriginsFilter
            onOriginsChange={setCustomerOrigins}
            origins={customerOrigins}
            disabled={isLoading}
          />

          <RanksFilter
            ranks={ranks}
            onRanksChange={setRanks}
            allRanks={allRanks}
            disabled={isLoading}
          />

          <div className="w-full flex gap-4 items-center justify-end">
            <ResetTableControlsBtn
              onReset={handleReset}
              hasFilters={
                ranks.length !== allRanks.length ||
                !!period?.from ||
                !!period?.to ||
                !!debouncedQuery
              }
              hasServerSorting={!!activeSorts.length}
              disabled={isLoading}
            />

            <SortingMenu
              disabled={isLoading}
              onChange={setActiveSorts}
              availableFields={Object.entries(sortingFields).map(([key, value]) => ({
                label: key,
                value: key,
                type: value.type,
              }))}
              activeSorts={activeSorts}
            />
          </div>
        </div>

        <Separator className="w-full"/>

        <Table table={table} maxRows={10} />

        <TablePagination
          table={table}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalCount={totalCount}
          disabled={isLoading}
        />

        <GoBack path="/home" />
      </div>
    </div>
  );
}
