"use client";

import Table from "../../../components/table/Table";
import GoBack from "../../../components/ui/misc/GoBack";
import useTable from "../../../hooks/table/useTable";
import columns from "./columns";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import CalendarFilter from "../../../components/ui/filters/calendar/CalendarFilter";
import CategoryFilter from "@/app/(site)/components/ui/filters/select/CategoryFilter";
import useProductsStats from "@/app/(site)/hooks/statistics/useProductsStats";
import ShiftFilter from "@/app/(site)/components/ui/filters/select/ShiftFilter";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import TODAY_PERIOD from "@/app/(site)/lib/shared/constants/today-period";
import ResetFiltersButton from "@/app/(site)/components/ui/filters/common/ResetFiltersButton";
import SortingMenu from "@/app/(site)/components/ui/sorting/SortingMenu";
import { CustomerContracts } from "@/app/(site)/lib/shared";

export type ProductStatsTableMeta = {
  filters?: NonNullable<CustomerContracts.GetAllComprehensive.Input>["filters"];
};

export default function ProductsStats() {
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
  } = useProductsStats();

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: filteredProducts,
    columns,
  });

  const table = useTable({
    data: tableData,
    columns: tableColumns,
    query: inputQuery,
    setQuery: setInputQuery,
    pagination: { mode: "client" },
    meta: {
      filters: { orders: { period: parsedFilters.period, shift: parsedFilters.shift } },
    } as ProductStatsTableMeta,
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] gap-4">
        <div className="w-full flex items-center gap-4">
          {/* <span className="font-bold text-xl">Pagamenti</span> */}

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
            <ResetFiltersButton
              onReset={handleReset}
              show={
                categoryIds.length !== allCategories.length ||
                period?.from?.getTime() !== TODAY_PERIOD?.from?.getTime() ||
                period?.to?.getTime() !== TODAY_PERIOD?.to?.getTime() ||
                !!inputQuery
              }
            />

            <SortingMenu
              disabled={isLoading}
              onChange={setActiveSorts}
              availableFields={Object.keys(sortingFields)}
              activeSorts={activeSorts}
            />
          </div>
        </div>

        <Table table={table} tableClassName="max-h-max" cellClassName={() => "h-20 max-h-20"} />

        <span>
          Totale:{" "}
          {!isLoading &&
            roundToTwo(
              table
                .getFilteredRowModel()
                .rows.reduce((sum, row) => sum + row.original.stats.revenue, 0)
            )}{" "}
          €
        </span>

        <GoBack path="/home" />
      </div>
    </div>
  );
}
