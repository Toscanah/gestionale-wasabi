import { z } from "zod";
import { PromotionSchema, PromotionUsageSchema } from "@/prisma/generated/schemas";
import { PromotionType } from "@prisma/client";
import { OrderSchema } from "@/prisma/generated/schemas";

/** ---------- Base Enriched Schemas ---------- */

export const PromotionWithUsagesSchema = PromotionSchema.extend({
  usages: z.array(PromotionUsageSchema),
});

/** ---------- Per-type discriminants ---------- */

export const FixedDiscountPromotionSchema = PromotionWithUsagesSchema.omit({
  percentage_value: true,
}).extend({
  type: z.literal(PromotionType.FIXED_DISCOUNT),
  fixed_amount: z.number().nonnegative(),
});

export const PercentageDiscountPromotionSchema = PromotionWithUsagesSchema.omit({
  fixed_amount: true,
}).extend({
  type: z.literal(PromotionType.PERCENTAGE_DISCOUNT),
  percentage_value: z.number().nonnegative(),
});

export const GiftCardPromotionSchema = PromotionWithUsagesSchema.omit({
  percentage_value: true,
}).extend({
  type: z.literal(PromotionType.GIFT_CARD),
  fixed_amount: z.number().nonnegative(),
});

/** ---------- Derived helpers ---------- */

/**
 * Promotion with computed remaining balance
 * (for gift cards or analytics)
 */
export const PromotionWithComputedBalanceSchema = PromotionWithUsagesSchema.extend({
  remaining_balance: z.number().nonnegative(),
});

/** ---------- Main discriminated union ---------- */
/** Exactly like your OrderByTypeSchema */

export const PromotionByTypeSchema = z.discriminatedUnion("type", [
  FixedDiscountPromotionSchema,
  PercentageDiscountPromotionSchema,
  GiftCardPromotionSchema,
]);

/** ---------- Optional: PromotionUsage enriched with order ---------- */
export const PromotionUsageWithOrderSchema = PromotionUsageSchema.extend({
  order: OrderSchema, // maybe more detailed order schema can be used here
  promotion: PromotionSchema,
});

export type PromotionWithUsages = z.infer<typeof PromotionWithUsagesSchema>;
export type FixedDiscountPromotion = z.infer<typeof FixedDiscountPromotionSchema>;
export type PercentageDiscountPromotion = z.infer<typeof PercentageDiscountPromotionSchema>;
export type GiftCardPromotion = z.infer<typeof GiftCardPromotionSchema>;
export type PromotionByType = z.infer<typeof PromotionByTypeSchema>;
export type PromotionUsageWithOrder = z.infer<typeof PromotionUsageWithOrderSchema>;
