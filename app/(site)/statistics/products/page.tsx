"use client";

import Table from "../../components/table/Table";
import SelectWrapper from "../../components/ui/select/SelectWrapper";
import GoBack from "../../components/ui/GoBack";
import getTable from "../../functions/util/getTable";
import columns from "./columns";
import useProductsStats, { ALL_CATEGORIES } from "../../hooks/statistics/useProductsStats";
import TableControls from "../../components/table/TableControls";
import useGlobalFilter from "../../hooks/useGlobalFilter";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";
import Calendar from "../../components/ui/calendar/Calendar";
import ShiftFilterSelector from "../../components/filters/ShiftFilterSelector";
import logo from "../../../../public/logo.png";
import Image from "next/image";

export enum TimeScopeFilter {
  ALL_TIME = "all_time",
  CUSTOM_RANGE = "custom_range",
}

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

  const table = getTable({
    data: filteredProducts,
    columns,
    globalFilter,
    setGlobalFilter,
  });

  const CategoryFilter = () => (
    <SelectWrapper
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
    <SelectWrapper
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
            <Calendar
              dateFilter={dateFilter}
              handleDateFilter={setDateFilter}
              mode="range"
              disabled={isLoading}
            />
          )}
        </TableControls>

        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Image src={logo} alt="logo" width={600} height={600} className="animate-spin" />
          </div>
        ) : (
          <Table table={table} tableClassName="max-h-max" />
        )}

        <span>
          Totale:{" "}
          {roundToTwo(
            table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.total, 0)
          )}{" "}
          €
        </span>

        <GoBack path="/home" />
      </div>
    </div>
  );
}
