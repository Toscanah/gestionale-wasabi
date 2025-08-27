"use client";

import useTable from "../../../hooks/table/useTable";
import Table from "../../../components/table/Table";
import columns from "./columns";
import TableControls from "../../../components/table/TableControls";
import useGlobalFilter from "../../../hooks/table/useGlobalFilter";
import WasabiSingleSelect from "../../../components/ui/select/WasabiSingleSelect";
import GoBack from "../../../components/ui/misc/GoBack";
import { DATE_PRESETS, DatePreset } from "../../../lib/shared/enums/DatePreset";
import CalendarFilter from "../../../components/ui/filters/calendar/CalendarFilter";
import RandomSpinner from "@/app/(site)/components/ui/misc/loader/RandomSpinner";
import { RFMRankRule } from "@/app/(site)/lib/shared/types/RFM";
import { useTheme } from "next-themes";
import useCustomersStats from "@/app/(site)/hooks/statistics/useCustomersStats";
import TablePagination from "@/app/(site)/components/table/TablePagination";
import usePagination from "@/app/(site)/hooks/table/usePagination";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WasabiPopover from "@/app/(site)/components/ui/popover/WasabiPopover";
import SelectFilter from "@/app/(site)/components/ui/filters/SelectFilter";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import ResetFiltersButton from "@/app/(site)/components/ui/filters/common/ResetFiltersButton";

export type CustomerStatsTableMeta = {
  ranks: RFMRankRule[];
  theme: string;
};

export default function CustomersStats() {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const { page, pageSize, setPage, setPageSize, resetPagination } = usePagination({});
  const {
    customers,
    dateFilter,
    rankFilter,
    setRankFilter,
    setDateFilter,
    handlePresetSelect,
    handleReset,
    isLoading,
    ranks,
    totalCount,
  } = useCustomersStats({ page, pageSize, search: globalFilter });
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
    meta: {
      ranks,
      theme: theme ?? "light",
    },
  });

  const ranksItems = [
    {
      value: "all",
      name: "Tutti i rank",
    },
    ...ranks.map((rank) => ({
      value: rank.rank,
      name: rank.rank,
    })),
  ];

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] gap-4">
        <div className="w-full flex gap-4 items-center">
          <SearchBar disabled={isLoading} filter={globalFilter} onChange={setGlobalFilter} />

          <SelectFilter
            title="Rank"
            mode="single"
            disabled={isLoading}
            inputPlaceholder="Cerca rank..."
            onChange={(value) => setRankFilter(value ?? "all")}
            groups={[
              {
                options: ranksItems.map((item) => ({
                  label: item.name,
                  value: item.value,
                })),
              },
            ]}
            selectedValue={rankFilter}
          />

          <CalendarFilter
            disabled={isLoading}
            dateFilter={dateFilter}
            presets={DATE_PRESETS}
            mode="range"
            handlePresetSelection={(value) => handlePresetSelect(value as DatePreset)}
            handleDateFilter={setDateFilter}
          />

          {(rankFilter !== "all" || !!dateFilter?.from || !!dateFilter?.to) && (
            <ResetFiltersButton onReset={handleReset} />
          )}
        </div>

        <Table table={table} tableClassName="max-h-max" cellClassName={() => "h-20 max-h-20"} />

        <TablePagination
          table={table}
          page={page}
          pageSize={pageSize}
          pageCount={Math.ceil(totalCount / pageSize)}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalCount={`${totalCount} clienti totali`}
        />

        <GoBack path="/home" />
      </div>
    </div>
  );
}
