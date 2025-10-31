import { PromotionType } from "@prisma/client";

export const PROMOTION_TYPE_LABELS: Record<PromotionType, string> = {
  [PromotionType.FIXED_DISCOUNT]: "Sconto fisso",
  [PromotionType.GIFT_CARD]: "Gift card",
  [PromotionType.PERCENTAGE_DISCOUNT]: "Sconto percentuale",
};

export const PROMOTION_COLORS: Record<PromotionType, string> = {
  [PromotionType.FIXED_DISCOUNT]:
    "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
  [PromotionType.GIFT_CARD]:
    "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700",
  [PromotionType.PERCENTAGE_DISCOUNT]:
    "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
};
