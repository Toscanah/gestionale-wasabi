import { PromotionType } from "@/prisma/generated/client/enums";
import {
  FixedDiscountPromotion,
  GiftCardPromotion,
  PercentageDiscountPromotion,
  PromotionByType,
} from "../entities/Promotion";

export const PromotionGuards = {
  isFixedDiscount: (p: PromotionByType): p is FixedDiscountPromotion =>
    p.type === PromotionType.FIXED_DISCOUNT,
  isPercentageDiscount: (p: PromotionByType): p is PercentageDiscountPromotion =>
    p.type === PromotionType.PERCENTAGE_DISCOUNT,
  isGiftCard: (p: PromotionByType): p is GiftCardPromotion => p.type === PromotionType.GIFT_CARD,
};
