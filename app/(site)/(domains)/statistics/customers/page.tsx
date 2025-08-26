"use client";

import useTable from "../../../hooks/table/useTable";
import Table from "../../../components/table/Table";
import columns from "./columns";
import TableControls from "../../../components/table/TableControls";
import useGlobalFilter from "../../../hooks/table/useGlobalFilter";
import SelectWrapper from "../../../components/ui/select/SelectWrapper";
import GoBack from "../../../components/ui/misc/GoBack";
import { DATE_PRESETS, DatePreset } from "../../../lib/shared/enums/DatePreset";
import Calendar from "../../../components/ui/calendar/Calendar";
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
        <TableControls
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
        >
          <SelectWrapper
            className="h-10"
            value={rankFilter}
            onValueChange={(rank) => setRankFilter(rank)}
            groups={[
              {
                items: ranksItems,
              },
            ]}
          />
          <Calendar
            dateFilter={dateFilter}
            presets={DATE_PRESETS}
            mode="range"
            handlePresetSelection={(value) => handlePresetSelect(value as DatePreset)}
            handleDateFilter={setDateFilter}
          />
        </TableControls>

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
