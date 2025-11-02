import { z } from "zod";
import { PromotionSchema, PromotionUsageSchema, OrderSchema } from "@/prisma/generated/schemas";
import { PromotionType } from "@prisma/client";

/**
 * Base: Promotion with usages loaded
 */
export const PromotionWithUsagesSchema = PromotionSchema.extend({
  usages: z.array(PromotionUsageSchema),
});

/**
 * PromotionUsage with its related order and promotion
 */
export const PromotionUsageWithOrderSchema = PromotionUsageSchema.extend({
  order: OrderSchema,
  promotion: PromotionWithUsagesSchema,
});

/**
 * 🪙 Fixed Discount
 * - Single-use, fixed amount
 * - percentage_value irrelevant
 * - reusable = false (always)
 */
export const FixedDiscountPromotionSchema = PromotionWithUsagesSchema.omit({
  percentage_value: true,
  max_usages: true, // not applicable
}).extend({
  type: z.literal(PromotionType.FIXED_DISCOUNT),
  fixed_amount: z.number().nonnegative(),
  reusable: z.literal(false),
});

/**
 * 💳 Gift Card
 * - Balance-based
 * - percentage_value irrelevant
 * - reusable = false (always)
 * - max_usages irrelevant
 */
export const GiftCardPromotionSchema = PromotionWithUsagesSchema.omit({
  percentage_value: true,
  max_usages: true,
}).extend({
  type: z.literal(PromotionType.GIFT_CARD),
  fixed_amount: z.number().nonnegative(),
  reusable: z.literal(false),
});

/**
 * 💸 Percentage Discount
 * - May be reusable
 * - May have max_usages limit
 * - fixed_amount irrelevant
 */
export const PercentageDiscountPromotionSchema = PromotionWithUsagesSchema.omit({
  fixed_amount: true,
}).extend({
  type: z.literal(PromotionType.PERCENTAGE_DISCOUNT),
  percentage_value: z.number().min(0).max(100),
  reusable: z.boolean().default(false),
  max_usages: z.number().int().positive().optional().nullable(),
});

/**
 * 🧮 Optional computed schema for gift cards (runtime)
 */
export const PromotionWithComputedBalanceSchema = PromotionWithUsagesSchema.extend({
  remaining_balance: z.number().nonnegative(),
});

export const PromotionByTypeSchema = z.discriminatedUnion("type", [
  FixedDiscountPromotionSchema,
  PercentageDiscountPromotionSchema,
  GiftCardPromotionSchema,
]);

/**
 * 🔠 Type exports
 */
export type PromotionWithUsages = z.infer<typeof PromotionWithUsagesSchema>;
export type PromotionUsageWithOrder = z.infer<typeof PromotionUsageWithOrderSchema>;

export type FixedDiscountPromotion = z.infer<typeof FixedDiscountPromotionSchema>;
export type PercentageDiscountPromotion = z.infer<typeof PercentageDiscountPromotionSchema>;
export type GiftCardPromotion = z.infer<typeof GiftCardPromotionSchema>;

export type PromotionByType = z.infer<typeof PromotionByTypeSchema>;
