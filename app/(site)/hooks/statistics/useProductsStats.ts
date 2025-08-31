import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import { DateRange } from "react-day-picker";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { ProductWithStats } from "@/app/(site)/lib/shared/types/product-with-stats";
import { CategoryContract, ProductContract, ShiftFilterValue } from "@/app/(site)/lib/shared"; // same enum used elsewhere
import { startOfDay, endOfDay } from "date-fns";
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
    staleTime: 1000 * 60 * 10,
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

  // ---- products query ----
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
    staleTime: 1000 * 60 * 5,
  });

  // ---- reset ----
  const handleReset = () => {
    setPeriod(TODAY_PERIOD);
    setShift(ShiftFilterValue.ALL);
    setCategoryIds(allCategories.map((c) => c.id)); // default = all categories
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
    isLoading: isLoading,
  };
}
