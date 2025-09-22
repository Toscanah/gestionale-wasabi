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
import usePagination from "@/app/(site)/hooks/table/usePagination";
import React from "react";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import ResetFiltersButton from "@/app/(site)/components/ui/filters/common/ResetFiltersButton";
import RankFilter from "@/app/(site)/components/ui/filters/select/RankFilter";
import SortingMenu from "@/app/(site)/components/ui/sorting/SortingMenu";

export type CustomerStatsTableMeta = {
  ranks: RFMRankRule[];
  theme: string;
};

export default function CustomersStats() {
  const { page, pageSize, setPage, setPageSize } = usePagination();
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
      pageIndex: page,
      pageCount: Math.ceil((totalCount || 0) / pageSize),
      onPaginationChange: (updater) => {
        const newState =
          typeof updater === "function" ? updater({ pageIndex: page, pageSize }) : updater;

        setPage(newState.pageIndex);
        setPageSize(newState.pageSize);
      },
    },
    meta: {
      ranks: rfmRanks,
      theme: theme ?? "light",
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] gap-4">
        <div className="w-full flex gap-4 items-center">
          <SearchBar disabled={isLoading} filter={inputQuery} onChange={setInputQuery} />

          <CalendarFilter
            usePresets
            disabled={isLoading}
            dateFilter={period}
            mode="range"
            handleDateFilter={setPeriod}
          />

          <RankFilter
            ranks={ranks}
            onRanksChange={setRanks}
            allRanks={allRanks}
            disabled={isLoading}
          />

          <div className="w-full flex gap-4 items-center justify-end">
            <ResetFiltersButton
              onReset={handleReset}
              show={
                ranks.length !== allRanks.length ||
                !!period?.from ||
                !!period?.to ||
                !!debouncedQuery
              }
            />

            <SortingMenu
              onChange={setActiveSorts}
              availableFields={Object.keys(sortingFields)}
              activeSorts={activeSorts}
            />
          </div>
        </div>

        <Table table={table} tableClassName="max-h-max" cellClassName={() => "h-20 max-h-20"} />

        <TablePagination
          table={table}
          page={page}
          pageSize={pageSize}
          pageCount={Math.ceil(totalCount / (pageSize ?? totalCount))}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalCount={totalCount}
        />

        <GoBack path="/home" />
      </div>
    </div>
  );
}
