"use client";

import Table from "../../../components/table/Table";
import GoBack from "../../../components/ui/misc/GoBack";
import useTable from "../../../hooks/table/useTable";
import columns from "./columns";
import CalendarFilter from "../../../components/ui/filters/calendar/CalendarFilter";
import CategoryFilter from "@/app/(site)/components/ui/filters/select/CategoryFilter";
import useProductsStats from "@/app/(site)/hooks/statistics/useProductsStats";
import ShiftFilter from "@/app/(site)/components/ui/filters/select/ShiftFilter";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import TODAY_PERIOD from "@/app/(site)/lib/shared/constants/today-period";
import ResetTableControlsBtn from "@/app/(site)/components/ui/filters/common/ResetTableControlsBtn";
import SortingMenu from "@/app/(site)/components/ui/sorting/SortingMenu";
import { CustomerContracts } from "@/app/(site)/lib/shared";
import { TableMeta } from "@tanstack/react-table";
import TablePagination from "@/app/(site)/components/table/TablePagination";
import useTablePagination from "@/app/(site)/hooks/table/useTablePagination";
import { useRef } from "react";
import useTableRowHeight from "@/app/(site)/hooks/table/useTableRowHeight";

export type ProductStatsTableMeta = TableMeta<any> & {
  filters?: NonNullable<CustomerContracts.GetAllComprehensive.Input>["filters"];
};

export default function ProductsStats() {
  const { page, pageSize, setPage, setPageSize } = useTablePagination({ initialPageSize: 10 });
  const {
    filteredProducts,
    allCategories,
    categoryIds,
    setCategoryIds,
    shift,
    setShift,
    period,
    setPeriod,
    handleReset,
    isLoading,
    sortingFields,
    activeSorts,
    setActiveSorts,
    parsedFilters,
    inputQuery,
    setInputQuery,
    totalCount,
  } = useProductsStats({ page, pageSize });

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: filteredProducts,
    columns,
  });

  const table = useTable<(typeof tableData)[number], ProductStatsTableMeta>({
    data: tableData,
    columns: tableColumns,
    query: inputQuery,
    setQuery: setInputQuery,
    pagination: { mode: "client" },
    meta: {
      filters: { orders: { period: parsedFilters.period, shift: parsedFilters.shift } },
      isLoading,
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col justify-center max-h-[90%] gap-4">
        <div className="w-full flex items-center gap-4">
          {/* <span className="font-bold text-xl">Statistica prodotti</span> */}

          <SearchBar disabled={isLoading} query={inputQuery} onChange={setInputQuery} />

          <CalendarFilter
            defaultValue={TODAY_PERIOD}
            mode="range"
            dateFilter={period}
            handleDateFilter={setPeriod}
            disabled={isLoading}
            useYears
          />

          <ShiftFilter selectedShift={shift} onShiftChange={setShift} disabled={isLoading} />

          <CategoryFilter
            selectedCategoryIds={categoryIds}
            onCategoryIdsChange={setCategoryIds}
            allCategories={allCategories}
            disabled={isLoading}
          />

          <div className="w-full flex gap-4 items-center justify-end">
            <ResetTableControlsBtn
              onReset={handleReset}
              hasFilters={
                categoryIds.length !== allCategories.length + 1 ||
                period?.from?.getTime() !== TODAY_PERIOD?.from?.getTime() ||
                period?.to?.getTime() !== TODAY_PERIOD?.to?.getTime() ||
                !!inputQuery
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

        <Table table={table} maxRows={10}/>

        <TablePagination
          table={table}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          totalCount={totalCount}
          disabled={isLoading}
        />

        {/* <span>
          Totale:{" "}
          {!isLoading &&
            roundToTwo(
              table
                .getFilteredRowModel()
                .rows.reduce((sum, row) => sum + row.original.stats.revenue, 0)
            )}{" "}
          €
        </span> */}

        <GoBack path="/home" />
      </div>
    </div>
  );
}
