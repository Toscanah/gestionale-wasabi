"use client";

import { cn } from "@/lib/utils";
import Table from "../../components/table/Table";
import SelectWrapper from "../../components/select/SelectWrapper";
import GoBack from "../../components/ui/GoBack";
import getTable from "../../functions/util/getTable";
import columns from "./columns";
import useProductsStats, { ALL_CATEGORIES } from "../../hooks/statistics/useProductsStats";
import TableControls from "../../components/table/TableControls";
import useGlobalFilter from "../../hooks/useGlobalFilter";
import { TimeFilter } from "../../sql/products/getProductsWithStats";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";
import Calendar from "../../components/calendar/Calendar";

export default function ProductsStats() {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();

  const {
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    timeFilter,
    setTimeFilter,
    dateFilter,
    setDateFilter,
    handleReset,
  } = useProductsStats();

  const table = getTable({
    data: filteredProducts,
    columns,
    globalFilter,
    setGlobalFilter,
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] gap-4">
        <TableControls
          table={table}
          onReset={handleReset}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        >
          <SelectWrapper
            defaultValue="all"
            value={selectedCategory.id.toString()}
            className="h-10"
            onValueChange={(value) =>
              setSelectedCategory(
                categories.find((c) => c.id.toString() === value) || ALL_CATEGORIES
              )
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

          <SelectWrapper
            value={timeFilter}
            className="h-10"
            onValueChange={(value) => setTimeFilter(value as TimeFilter)}
            groups={[
              {
                items: [
                  { name: "Da sempre", value: "all" },
                  { name: "Arco temporale", value: "custom" },
                ],
              },
            ]}
          />

          {timeFilter === "custom" && (
            <Calendar dateFilter={dateFilter} handleDateFilter={setDateFilter} mode="range" />
          )}
        </TableControls>

        <Table table={table} tableClassName="max-h-max" />

        <span>
          Totale: {roundToTwo(filteredProducts.reduce((sum, product) => sum + product.total, 0))} €
        </span>

        <GoBack path="/home" />
      </div>
    </div>
  );
}
