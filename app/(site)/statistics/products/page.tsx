"use client";

import { useEffect, useState } from "react";
import Table from "../../components/table/Table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import getTable from "../../functions/util/getTable";
import columns from "./columns";
import fetchRequest from "../../functions/api/fetchRequest";
import { ProductWithStats } from "../../types/ProductWithStats";
import { DateRange } from "react-day-picker";
import { TimeFilter } from "../../sql/products/getProductsWithStats";
import TableControls from "../../components/table/TableControls";
import useGlobalFilter from "../../components/hooks/useGlobalFilter";
import SelectWrapper from "../../components/select/SelectWrapper";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { it } from "date-fns/locale";
import GoBack from "../../components/GoBack";
import { Category } from "@prisma/client";

const allCategories = {
  id: -1,
  category: "all",
  active: true,
};

export default function ProductsStats() {
  const [globalFilter, setGlobalFilter] = useGlobalFilter();
  const [products, setProducts] = useState<ProductWithStats[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithStats[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: -1,
    category: "all",
    active: true,
  });

  const defaultStartDate = new Date(new Date().setHours(0, 0, 0, 0));
  const defaultEndDate = new Date(new Date().setHours(23, 59, 59, 999));

  const [timeFilter, setTimeFilter] = useState<TimeFilter>(TimeFilter.ALL);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: defaultStartDate,
    to: defaultEndDate,
  });

  const table = getTable({ data: filteredProducts, columns, globalFilter, setGlobalFilter });

  useEffect(() => {
    fetchInitialProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (timeFilter == TimeFilter.CUSTOM) {
      if (dateFilter?.from && dateFilter.to) {
        fetchProductsWithFilter(timeFilter, dateFilter);
      } else {
        setFilteredProducts([]);
      }
    } else {
      fetchInitialProducts();
    }
  }, [timeFilter, dateFilter]);

  useEffect(() => {
    setFilteredProducts((currentFilteredProducts) => {
      if (selectedCategory.id === -1) {
        return currentFilteredProducts;
      } else {
        return currentFilteredProducts.filter(
          (product) => product.category_id === selectedCategory.id
        );
      }
    });
  }, [selectedCategory]);

  const fetchCategories = () =>
    fetchRequest<Category[]>("GET", "/api/categories/", "getCategories").then((categories) => {
      setCategories(categories.filter((c) => c.active));
      console.log(categories);
    });

  const fetchInitialProducts = () =>
    fetchRequest<ProductWithStats[]>("GET", "/api/products", "getProductsWithStats", {
      timeFilter: TimeFilter.ALL,
      from: undefined,
      to: undefined,
    }).then((products) => {
      setProducts(products);
      setFilteredProducts(products);
    });

  const fetchProductsWithFilter = (timeFilter: TimeFilter, value: DateRange) =>
    fetchRequest<ProductWithStats[]>("GET", "/api/products", "getProductsWithStats", {
      timeFilter,
      ...value,
    }).then((products) => {
      setFilteredProducts(products);
    });

  const handleReset = () => {
    setTimeFilter(TimeFilter.ALL);
    setDateFilter({
      from: defaultStartDate,
      to: defaultEndDate,
    });
    fetchInitialProducts();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex flex-col max-h-[90%] gap-4">
        <TableControls
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          table={table}
          onReset={handleReset}
        >
          <SelectWrapper
            defaultValue="all"
            value={selectedCategory.id.toString()}
            className="h-10"
            onValueChange={(value) =>
              setSelectedCategory(categories.find((c) => c.id.toString() == value) || allCategories)
            }
            groups={[
              {
                items: [
                  { name: "Tutte le categorie", value: "-1" },
                  ...categories.map((category) => ({
                    name: category.category.toString(),
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

          {timeFilter == TimeFilter.CUSTOM && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[50rem] justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter?.from ? (
                    dateFilter.to ? (
                      <>
                        {format(dateFilter.from, "PPP", { locale: it })} -{" "}
                        {format(dateFilter.to, "PPP", { locale: it })}
                      </>
                    ) : (
                      format(dateFilter.from, "PPP", { locale: it })
                    )
                  ) : (
                    <span>Seleziona una data</span>
                  )}
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

        <GoBack path="/home" />
      </div>
    </div>
  );
}
