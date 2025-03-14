"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import Table from "../../components/table/Table";
import SelectWrapper from "../../components/select/SelectWrapper";
import GoBack from "../../components/ui/GoBack";
import getTable from "../../functions/util/getTable";
import columns from "./columns";
import useProductsStats, { allCategories } from "../../hooks/statistics/useProductsStats";
import TableControls from "../../components/table/TableControls";
import useGlobalFilter from "../../hooks/useGlobalFilter";
import { TimeFilter } from "../../sql/products/getProductsWithStats";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";

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
                categories.find((c) => c.id.toString() === value) || allCategories
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-[50rem] justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter?.from
                    ? dateFilter.to
                      ? `${format(dateFilter.from, "PPP", { locale: it })} - ${format(
                          dateFilter.to,
                          "PPP",
                          { locale: it }
                        )}`
                      : format(dateFilter.from, "PPP", { locale: it })
                    : "Seleziona una data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  locale={it}
                  initialFocus
                  mode="range"
                  defaultMonth={dateFilter?.from}
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
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
