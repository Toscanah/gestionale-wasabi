"use client";

import Table from "../../../components/table/Table";
import WasabiSingleSelect from "../../../components/ui/select/WasabiSingleSelect";
import GoBack from "../../../components/ui/misc/GoBack";
import useTable from "../../../hooks/table/useTable";
import columns from "./columns";
import TableControls from "../../../components/table/TableControls";
import useQueryFilter from "../../../hooks/table/useGlobalFilter";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import CalendarFilter from "../../../components/ui/filters/calendar/CalendarFilter";
import RandomSpinner from "../../../components/ui/misc/loader/RandomSpinner";
import CategoryFilter from "@/app/(site)/components/ui/filters/select/CategoryFilter";
import useProductsStats from "@/app/(site)/hooks/statistics/useProductsStats";
import ShiftFilter from "@/app/(site)/components/ui/filters/select/ShiftFilter";
import SearchBar from "@/app/(site)/components/ui/filters/common/SearchBar";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";

export default function ProductsStats() {
  const { inputQuery, setInputQuery } = useQueryFilter();

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
    showReset,
    isLoading,
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
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] gap-4">
        <div className="w-full flex items-center gap-4">
          <span className="font-bold text-xl">Pagamenti</span>
          <SearchBar disabled={isLoading} filter={inputQuery} onChange={setInputQuery} />

          <ShiftFilter selectedShift={shift} onShiftChange={setShift} disabled={isLoading} />

          <CategoryFilter
            selectedCategoryIds={categoryIds}
            onCategoryIdsChange={setCategoryIds}
            allCategories={allCategories}
          />

          <CalendarFilter
            mode="range"
            dateFilter={period}
            handleDateFilter={setPeriod}
            disabled={isLoading}
          />
        </div>

        <Table table={table} tableClassName="max-h-max" cellClassName={() => "h-20 max-h-20"} />

        <span>
          Totale:{" "}
          {!isLoading &&
            roundToTwo(
              table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.total, 0)
            )}{" "}
          €
        </span>

        <GoBack path="/home" />
      </div>
    </div>
  );
}
