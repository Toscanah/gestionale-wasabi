"use client";

import Table from "../../../../../components/table/Table";
import GoBack from "@/components/shared/misc/GoBack";
import useTable from "../../../../../hooks/table/useTable";
import columns from "./columns";
import CalendarFilter from "@/components/shared/filters/calendar/CalendarFilter";
import CategoryFilter from "@/components/shared/filters/select/CategoryFilter";
import useProductsStats from "@/hooks/statistics/useProductsStats";
import ShiftFilter from "@/components/shared/filters/select/ShiftFilter";
import SearchBar from "@/components/shared/filters/common/SearchBar";
import useSkeletonTable from "@/hooks/table/useSkeletonTable";
import TODAY_PERIOD from "@/lib/shared/constants/today-period";
import ResetTableControlsBtn from "@/components/shared/filters/common/ResetTableControlsBtn";
import SortingMenu from "@/components/shared/sorting/SortingMenu";
import { CustomerContracts, ShiftFilterValue } from "@/lib/shared";
import { TableMeta } from "@tanstack/react-table";
import TablePagination from "@/components/table/TablePagination";
import useTablePagination from "@/hooks/table/useTablePagination";
import TableColumnsVisibility from "@/components/table/TableColumnsVisibility";
import roundToTwo from "@/lib/shared/utils/global/number/roundToTwo";
import CsvExportButton from "@/components/shared/misc/CsvExportButton";
import useCsvExport from "@/hooks/csv-export/useCsvExport";
import toEuro from "@/lib/shared/utils/global/string/toEuro";

export type ProductStatsTableMeta = TableMeta<any> & {
  filters?: NonNullable<CustomerContracts.GetAllComprehensive.Input>["filters"];
};

export default function ProductsStats() {
  const { page, pageSize } = useTablePagination({ initialPageSize: 10 });
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
    resetQuery,
    debouncedQuery,
  } = useProductsStats({ page, pageSize });

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: filteredProducts,
    columns,
  });

  const table = useTable<(typeof tableData)[number], ProductStatsTableMeta>({
    data: tableData,
    columns: tableColumns,
    query: debouncedQuery,
    setQuery: setInputQuery,
    pagination: { mode: "client", pageSize },
    meta: {
      filters: { orders: { period: parsedFilters.period, shift: parsedFilters.shift } },
      isLoading,
    },
  });

  console.log(table.getAllColumns());

  const { exportCsv } = useCsvExport(table);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col justify-center max-h-[90%] gap-4">
        <div className="w-full flex items-center gap-4">
          {/* <span className="font-bold text-xl">Statistica prodotti</span> */}

          <div className="flex-1 gap-4 flex items-center ">
            <SearchBar
              disabled={isLoading}
              query={inputQuery}
              onChange={setInputQuery}
              onReset={resetQuery}
            />

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
          </div>

          <div className="w-full flex gap-4 items-center justify-end flex-wrap">
            <ResetTableControlsBtn
              onReset={() => {
                handleReset();
                table.resetSorting();
                table.resetPagination();
              }}
              table={table}
              hasFilters={
                (!isLoading &&
                  allCategories.length > 0 &&
                  categoryIds.length !== allCategories.length + 1) ||
                period?.from?.getTime() !== TODAY_PERIOD?.from?.getTime() ||
                period?.to?.getTime() !== TODAY_PERIOD?.to?.getTime() ||
                !!inputQuery ||
                shift !== ShiftFilterValue.ALL
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

            <TableColumnsVisibility table={table} disabled={isLoading} />

            {/* <CsvExportButton disabled={isLoading} onClick={() => exportCsv({})} /> */}
          </div>
        </div>

        <Table table={table} maxRows={10} scrollAdjustment={1} />

        <TablePagination
          label="Prodotti"
          table={table}
          // page={page}
          // pageSize={pageSize}
          // onPageChange={setPage}
          // onPageSizeChange={setPageSize}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Totale: ... €</span>
          ) : (
            <span>
              Totale:{" "}
              {!isLoading &&
                toEuro(
                  table
                    .getPrePaginationRowModel()
                    .rows.reduce((sum, row) => sum + row.original.stats.revenue, 0)
                )}
            </span>
          )}
        </TablePagination>

        <GoBack path="/home" />
      </div>
    </div>
  );
}
