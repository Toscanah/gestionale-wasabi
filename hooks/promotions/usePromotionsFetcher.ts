import { promotionsAPI } from "@/lib/trpc/api";
import { PromotionType } from "@/prisma/generated/schemas";
import { useMemo, useState } from "react";
import { ALL_PROMOTION_TYPES } from "@/components/shared/filters/select/PromotionTypesFilter";
import { PromotionContracts } from "@/lib/shared";
import { PromotionPeriodCondition } from "@/lib/shared/contracts/common/filters/promotion-periods";
import { trpc } from "@/lib/trpc/client";

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

  const deletePromotionMutation = promotionsAPI.deleteById.useMutation();

  const utils = trpc.useUtils();

  const deletePromotionById = async (promotionId: number) => {
    await deletePromotionMutation.mutateAsync({ id: promotionId });
    utils.promotions.getAll.setData({ filters }, (old) =>
      old ? old.filter((promotion) => promotion.id !== promotionId) : []
    );
    await utils.promotions.countsByType.invalidate();
  };

  const invalidatePromotions = async () => {
    await utils.promotions.invalidate();
    await utils.promotions.getAll.refetch();
    await utils.promotions.countsByType.refetch();
  };

  return {
    promotions,
    promotionCounts,
    isLoading: isLoading || isFetching || isLoadingCounts || isFetchingCounts,
    selectedPromotionTypes,
    setSelectedPromotionTypes,
    periods,
    setPeriods,
    deletePromotionById,
    invalidatePromotions,
  };
}
