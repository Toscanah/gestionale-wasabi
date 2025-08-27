"use client";

import Table from "../../../components/table/Table";
import WasabiSingleSelect from "../../../components/ui/select/WasabiSingleSelect";
import GoBack from "../../../components/ui/misc/GoBack";
import useTable from "../../../hooks/table/useTable";
import columns from "./columns";
import useProductsStats, { ALL_CATEGORIES } from "../../../hooks/statistics/useProductsStats";
import TableControls from "../../../components/table/TableControls";
import useGlobalFilter from "../../../hooks/table/useGlobalFilter";
import roundToTwo from "../../../lib/utils/global/number/roundToTwo";
import CalendarFilter from "../../../components/ui/filters/calendar/CalendarFilter";
import ShiftFilterSelector from "../../../components/filters/shift/ShiftFilterSelector";
import TimeScopeFilter from "../../../components/filters/shift/TimeScope";
import RandomSpinner from "../../../components/ui/misc/loader/RandomSpinner";

export default function ProductsStats() {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();

  const {
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    timeScopeFilter,
    setTimeScopeFilter,
    dateFilter,
    setDateFilter,
    shiftFilter,
    setShiftFilter,
    handleReset,
    isLoading,
  } = useProductsStats();

  const table = useTable({
    data: filteredProducts,
    columns,
    globalFilter,
    setGlobalFilter,
  });

  const CategoryFilter = () => (
    <WasabiSingleSelect
      disabled={isLoading}
      defaultValue="all"
      value={selectedCategory.id.toString()}
      className="h-10"
      onValueChange={(value) =>
        setSelectedCategory(categories.find((c) => c.id.toString() === value) || ALL_CATEGORIES)
      }
      groups={[
        {
          items: [
            { name: "Tutte le categorie", value: "-1" },
            ...categories.map((category) => ({
              name: category.category,
              value: category.id.toString(),
            })),
          ],
        },
      ]}
    />
  );

  const TimeScope = () => (
    <WasabiSingleSelect
      disabled={isLoading}
      value={timeScopeFilter}
      className="h-10"
      onValueChange={(value) => setTimeScopeFilter(value as TimeScopeFilter)}
      groups={[
        {
          items: [
            { name: "Da sempre", value: TimeScopeFilter.ALL_TIME },
            { name: "Arco temporale", value: TimeScopeFilter.CUSTOM_RANGE },
          ],
        },
      ]}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] gap-4">
        <TableControls
          table={table}
          searchBarDisabled={isLoading}
          resetDisabled={isLoading}
          onReset={handleReset}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        >
          <ShiftFilterSelector
            shiftFilter={shiftFilter}
            onShiftChange={setShiftFilter}
            disabled={isLoading}
          />

          <CategoryFilter />

          <TimeScope />

          {timeScopeFilter === TimeScopeFilter.CUSTOM_RANGE && (
            <CalendarFilter
              dateFilter={dateFilter}
              handleDateFilter={setDateFilter}
              mode="range"
              disabled={isLoading}
            />
          )}
        </TableControls>

        {isLoading ? (
          <RandomSpinner isLoading={isLoading} />
        ) : (
          <Table table={table} tableClassName="max-h-max" />
        )}

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
