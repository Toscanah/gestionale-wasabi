import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  ProductContracts,
  ProductStatsSortField,
  ProductWithStats,
  ShiftFilterValue,
} from "@/app/(site)/lib/shared"; // same enum used elsewhere
import TODAY_PERIOD from "../../lib/shared/constants/today-period";
import { trpc } from "@/lib/server/client";
import { SortField } from "../../components/ui/sorting/SortingMenu";
import useQueryFilter from "../table/useQueryFilter";

export const PRODUCT_STATS_SORT_MAP: Record<string, ProductStatsSortField> = {
  Quantità: "unitsSold",
  Totale: "revenue",
  "Totale riso": "totalRice",
} as const;

export default function useProductsStats() {
  const [period, setPeriod] = useState<DateRange | undefined>(TODAY_PERIOD);
  const [shift, setShift] = useState<ShiftFilterValue>(ShiftFilterValue.ALL);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);

  const { inputQuery, setInputQuery, debouncedQuery } = useQueryFilter();
  const [activeSorts, setActiveSorts] = useState<SortField[]>([]);

  const { data: allCategories = [], ...catQuery } = trpc.categories.getAll.useQuery(undefined, {
    select: (categories) => categories.filter((c) => c.active),
  });

  const filters: NonNullable<ProductContracts.ComputeStats.Input>["filters"] = useMemo(() => {
    const periodFilter = period?.from
      ? { from: period.from, to: period.to ?? period.from }
      : undefined;

    const shiftFilter = shift === ShiftFilterValue.ALL ? undefined : shift;

    const categoryFilter =
      categoryIds.length === 0 || categoryIds.length === allCategories.length
        ? undefined
        : categoryIds;

    const search = debouncedQuery && debouncedQuery.trim() !== "" ? debouncedQuery : undefined;

    return {
      period: periodFilter,
      shift: shiftFilter,
      categoryIds: categoryFilter,
      query: search,
    };
  }, [period, shift, categoryIds, allCategories]);

  const sorting = useMemo(() => {
    return activeSorts.map((s) => ({
      field: PRODUCT_STATS_SORT_MAP[s.field as ProductStatsSortField],
      direction: s.direction,
    }));
  }, [activeSorts]);

  useEffect(() => {
    if (allCategories.length > 0 && categoryIds.length === 0) {
      setCategoryIds(allCategories.map((c) => c.id));
    }
  }, [allCategories, categoryIds.length]);

  const { data: baseProducts, ...baseQuery } = trpc.products.getAll.useQuery();

  const computeQuery = trpc.products.computeStats.useQuery(
    {
      filters,
      sort: sorting.length > 0 ? sorting : undefined,
    },
    {
      enabled: !!baseProducts,
      select: (data) => {
        if (!baseProducts) return [] as ProductWithStats[];

        const baseMap = new Map(baseProducts.map((c) => [c.id, c]));

        return data.productsStats.flatMap((ps) => {
          const { productId, ...stats } = ps;
          const base = baseMap.get(productId);
          if (!base) return [];
          return { ...base, stats };
        }) as ProductWithStats[];
      },
    }
  );

  const handleReset = () => {
    setPeriod(TODAY_PERIOD);
    setShift(ShiftFilterValue.ALL);
    setCategoryIds(allCategories.map((c) => c.id));
    setInputQuery("");
    setActiveSorts([]);
  };

  return {
    filteredProducts: computeQuery.data ?? [],
    allCategories,
    categoryIds,
    setCategoryIds,
    shift,
    setShift,
    debouncedQuery,
    inputQuery,
    setInputQuery,
    period,
    setPeriod,
    handleReset,
    isLoading:
      computeQuery.isLoading ||
      computeQuery.isFetching ||
      catQuery.isLoading ||
      catQuery.isFetching ||
      baseQuery.isLoading ||
      baseQuery.isFetching,
    sortingFields: PRODUCT_STATS_SORT_MAP,
    activeSorts,
    setActiveSorts,
    parsedFilters: filters,
  };
}
