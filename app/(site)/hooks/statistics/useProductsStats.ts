import { useCallback, useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { DateRange } from "react-day-picker";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { ProductWithStats } from "@/app/(site)/shared/types/ProductWithStats";
import TimeScopeFilter from "../../components/filters/shift/TimeScope";
import { ShiftFilter } from "../../shared/types/ShiftFilter";

const DEFAULT_START_DATE = new Date(new Date().setHours(0, 0, 0, 0));
const DEFAULT_END_DATE = new Date(new Date().setHours(23, 59, 59, 999));
const DEFAULT_DATE: DateRange = {
  from: DEFAULT_START_DATE,
  to: DEFAULT_END_DATE,
};

export const ALL_CATEGORIES = {
  id: -1,
  category: "all",
  active: true,
};

export default function useProductsStats() {
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState<ProductWithStats[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithStats[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(ALL_CATEGORIES);

  const [timeScopeFilter, setTimeScopeFilter] = useState<TimeScopeFilter>(TimeScopeFilter.ALL_TIME);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(DEFAULT_DATE);
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>(ShiftFilter.BOTH);

  useEffect(() => {
    fetchInitialProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const isCustom = timeScopeFilter === TimeScopeFilter.CUSTOM_RANGE;
    const hasValidDates = dateFilter?.from && dateFilter?.to;

    if (isCustom && !hasValidDates) {
      setFilteredProducts([]);
      return;
    }

    fetchProductsWithFilter();
  }, [timeScopeFilter, dateFilter, shiftFilter, selectedCategory]);

  const fetchCategories = () =>
    fetchRequest<Category[]>("GET", "/api/categories/", "getCategories").then((fetchedCategories) =>
      setCategories(fetchedCategories.filter((c) => c.active))
    );

  const fetchInitialProducts = () => {
    setIsLoading(true);

    fetchRequest<ProductWithStats[]>("POST", "/api/products", "getProductsWithStats", {
      filters: {
        time: {
          timeScope: TimeScopeFilter.ALL_TIME,
        },
        shift: ShiftFilter.BOTH,
      },
    })
      .then(setProducts)
      .finally(() => setIsLoading(false));
  };

  const fetchProductsWithFilter = useCallback(() => {
    setIsLoading(true);
    fetchRequest<ProductWithStats[]>("POST", "/api/products", "getProductsWithStats", {
      filters: {
        time: {
          timeScope: timeScopeFilter,
          from: dateFilter?.from ? new Date(dateFilter.from) : undefined,
          to: dateFilter?.to ? new Date(dateFilter.to) : undefined,
        },
        shift: shiftFilter,
        categoryId: selectedCategory.id === -1 ? undefined : selectedCategory.id,
      },
    })
      .then(setFilteredProducts)
      .finally(() => setIsLoading(false));
  }, [timeScopeFilter, dateFilter, shiftFilter, selectedCategory]);

  const handleReset = () => {
    setTimeScopeFilter(TimeScopeFilter.ALL_TIME);
    setDateFilter(DEFAULT_DATE);
    setSelectedCategory(ALL_CATEGORIES);
    setShiftFilter(ShiftFilter.BOTH);
    fetchInitialProducts();
  };

  return {
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
  };
}
