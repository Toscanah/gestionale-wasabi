import z from "zod";
import { DateRangeSchema } from "./period";

export const PromotionPeriodTypeSchema = z.enum(["creation", "usage", "expiration"]);
export type PromotionPeriodType = z.infer<typeof PromotionPeriodTypeSchema>;

export const PromotionPeriodConditionSchema = z.object({
  type: PromotionPeriodTypeSchema,
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
export type PromotionPeriodCondition = z.infer<typeof PromotionPeriodConditionSchema>;

export const PromotionPeriodRequestSchema = z.object({
  periods: z.array(PromotionPeriodConditionSchema).min(0).max(3),
});
export type PromotionPeriodRequest = z.infer<typeof PromotionPeriodRequestSchema>;
