import { promotionsAPI } from "@/lib/server/api";
import { PromotionType } from "@/prisma/generated/schemas";
import { useMemo, useState } from "react";
import { ALL_PROMOTION_TYPES } from "../../components/ui/filters/select/PromotionTypesFilter";
import { PromotionContracts } from "../../lib/shared";
import { PromotionPeriodCondition } from "../../lib/shared/schemas/common/filters/promotion-periods";

export default function usePromotionsFetcher() {
  const [selectedPromotionTypes, setSelectedPromotionTypes] =
    useState<PromotionType[]>(ALL_PROMOTION_TYPES);
  const [periods, setPeriods] = useState<PromotionPeriodCondition[] | undefined>(undefined);

  const filters: NonNullable<PromotionContracts.GetAll.Input>["filters"] = useMemo(() => {
    const finalSelectedTypes =
      selectedPromotionTypes.length === ALL_PROMOTION_TYPES.length
        ? undefined
        : selectedPromotionTypes;

    const finalPeriods = periods && periods.length > 0 ? periods : undefined;

    if (!finalSelectedTypes && !finalPeriods) {
      return undefined;
    }

    return {
      promotionTypes: finalSelectedTypes,
      periods: finalPeriods,
    };
  }, [selectedPromotionTypes, periods]);

  const {
    data: promotionCounts,
    isLoading: isLoadingCounts,
    isFetching: isFetchingCounts,
  } = promotionsAPI.countsByType.useQuery();

  const {
    data: promotions,
    isLoading,
    isFetching,
  } = promotionsAPI.getAll.useQuery(
    { filters },
    {
      enabled: !!promotionCounts,
    }
  );

  return {
    promotions,
    promotionCounts,
    isLoading: isLoading || isFetching || isLoadingCounts || isFetchingCounts,
    selectedPromotionTypes,
    setSelectedPromotionTypes,
    periods,
    setPeriods,
  };
}
