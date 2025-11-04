"use client";

import Table from "../../components/table/Table";
import TableColumnsVisibility from "../../components/table/TableColumnsVisibility";
import TablePagination from "../../components/table/TablePagination";
import ResetTableControlsBtn from "../../components/ui/filters/common/ResetTableControlsBtn";
import SearchBar from "../../components/ui/filters/common/SearchBar";
import PromotionPeriodsMenu from "../../components/ui/filters/PromotionPeriodsMenu";
import PromotionTypesFilter from "../../components/ui/filters/select/PromotionTypesFilter";
import GoBack from "../../components/ui/misc/GoBack";
import usePromotionsManager from "../../hooks/promotions/usePromotionsManager";
import useQueryFilter from "../../hooks/table/useQueryFilter";
import useSkeletonTable from "../../hooks/table/useSkeletonTable";
import useTable from "../../hooks/table/useTable";
import CreatePromotionDialog from "./create/CreatePromotionDialog";
import promotionColumns from "./promotionColumns";

export default function PromotionsPage() {
  const {
    promotions,
    isLoading,
    selectedPromotionTypes,
    setSelectedPromotionTypes,
    promotionCounts,
    periods,
    setPeriods,
  } = usePromotionsManager();
  const { inputQuery, setInputQuery } = useQueryFilter();

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading,
    data: promotions ?? [],
    columns: promotionColumns,
  });

  const table = useTable<(typeof tableData)[number], any>({
    data: tableData,
    columns: tableColumns,
    query: inputQuery,
    setQuery: setInputQuery,
    pagination: { mode: "client", pageSize: 10 },
    meta: {
      isLoading,
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col justify-center max-h-[90%] gap-4">
        <div className="w-full flex items-center gap-4">
          <span className="font-bold text-xl">Promozioni</span>

          <div className="flex-1 gap-4 flex items-center ">
            <SearchBar disabled={isLoading} query={inputQuery} onChange={setInputQuery} />

            {/* <CalendarFilter
              defaultValue={TODAY_PERIOD}
              mode="range"
              dateFilter={period}
              handleDateFilter={setPeriod}
              disabled={isLoading}
              useYears
            /> */}

            <PromotionTypesFilter
              typeCounts={promotionCounts!}
              selectedTypes={selectedPromotionTypes}
              onTypesChange={setSelectedPromotionTypes}
              disabled={isLoading}
            />

            <PromotionPeriodsMenu
              disabled={isLoading}
              activePeriods={periods ?? []}
              onChange={setPeriods}
            />
          </div>

          <div className="w-full flex gap-4 items-center justify-end flex-wrap">
            <ResetTableControlsBtn
              onReset={() => {
                table.resetSorting();
                table.resetPagination();
              }}
              table={table}
              hasFilters={false}
              // hasServerSorting={!!activeSorts.length}
              disabled={isLoading}
            />

            {/* <SortingMenu
              disabled={isLoading}
              onChange={setActiveSorts}
              availableFields={Object.entries(sortingFields).map(([key, value]) => ({
                label: key,
                value: key,
                type: value.type,
              }))}
              activeSorts={activeSorts}
            /> */}

            <TableColumnsVisibility table={table} disabled={isLoading} />

            <CreatePromotionDialog disabled={isLoading} />
          </div>
        </div>

        <Table table={table} maxRows={10} scrollAdjustment={1} />

        <TablePagination label="Promozioni" table={table} disabled={isLoading} />

        <GoBack path="/home" />
      </div>
    </div>
  );
}
