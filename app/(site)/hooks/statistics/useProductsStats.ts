import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import { DateRange } from "react-day-picker";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { ProductWithStats } from "@/app/(site)/lib/shared/types/product-with-stats";
import { CategoryContract, ProductContract, ShiftFilterValue } from "@/app/(site)/lib/shared"; // same enum used elsewhere
import TODAY_PERIOD from "../../lib/shared/constants/today-period";

export default function useProductsStats() {
  const [period, setPeriod] = useState<DateRange | undefined>(TODAY_PERIOD);
  const [shift, setShift] = useState<ShiftFilterValue>(ShiftFilterValue.ALL);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (
        await fetchRequest<CategoryContract["Responses"]["GetCategories"]>(
          "GET",
          "/api/categories",
          "getCategories"
        )
      ).filter((c) => c.active),
    staleTime: Infinity,
  });

  const filters: ProductContract["Requests"]["GetProductsWithStats"]["filters"] = useMemo(() => {
    const periodFilter = period?.from
      ? { from: period.from, to: period.to ?? period.from }
      : undefined;

    const shiftFilter = shift === ShiftFilterValue.ALL ? undefined : shift;

    const categoryFilter =
      categoryIds.length === 0 || categoryIds.length === allCategories.length
        ? undefined
        : categoryIds;

    return {
      period: periodFilter,
      shift: shiftFilter,
      categoryIds: categoryFilter,
    };
  }, [period, shift, categoryIds, allCategories]);

  useEffect(() => {
    if (allCategories.length > 0 && categoryIds.length === 0) {
      setCategoryIds(allCategories.map((c) => c.id));
    }
  }, [allCategories, categoryIds.length]);

  const { data: shiftBackfill } = useQuery({
    queryKey: ["shiftBackfill"],
    queryFn: () => fetchRequest("PATCH", "/api/orders", "updateOrdersShift"),
    staleTime: Infinity,
    enabled: Array.isArray(allCategories) && allCategories.length > 0,
  });

  const { data: filteredProducts = [], isLoading } = useQuery({
    queryKey: ["products-stats", { filters }],
    queryFn: async (): Promise<ProductWithStats[]> => {
      return await fetchRequest<ProductWithStats[]>(
        "POST",
        "/api/products",
        "getProductsWithStats",
        { filters }
      );
    },
    enabled: !!shiftBackfill,
    staleTime: 1000 * 60 * 5,
  });

  const handleReset = () => {
    setPeriod(TODAY_PERIOD);
    setShift(ShiftFilterValue.ALL);
    setCategoryIds(allCategories.map((c) => c.id));
  };

  const showReset =
    shift !== ShiftFilterValue.ALL ||
    categoryIds.length !== allCategories.length ||
    !(
      period?.from?.getTime() === TODAY_PERIOD.from?.getTime() &&
      period?.to?.getTime() === TODAY_PERIOD.to?.getTime()
    );

  return {
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
  };
}
