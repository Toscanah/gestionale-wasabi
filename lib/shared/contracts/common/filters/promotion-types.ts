import { PromotionType } from "@/prisma/generated/client/enums";
import z from "zod";

export const PromotionTypesFilterSchema = z.object({
  promotionTypes: z.array(z.enum(PromotionType)),
});

export type PromotionTypesFilter = z.infer<typeof PromotionTypesFilterSchema>;
