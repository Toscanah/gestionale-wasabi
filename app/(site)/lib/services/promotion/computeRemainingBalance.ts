import { PromotionByType, PromotionGuards } from "../../shared";

export default function computeRemainingBalance(promo: PromotionByType): number {
  if (!PromotionGuards.isGiftCard(promo)) return 0;
  const used = promo.usages.reduce((sum, u) => sum + u.amount, 0);
  return Math.max(0, promo.fixed_amount - used);
}
