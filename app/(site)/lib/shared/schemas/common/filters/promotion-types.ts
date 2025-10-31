import { PromotionType } from "@prisma/client";
import z from "zod";

export const PromotionTypesFilterSchema = z.object({
  promotionTypes: z.array(z.enum(PromotionType)),
});

export type PromotionTypesFilter = z.infer<typeof PromotionTypesFilterSchema>;
