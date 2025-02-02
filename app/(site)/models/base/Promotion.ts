import { PromotionSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { ProductWithCategorySchema } from "./Product";

export const PromotionWithCustomerAndProduct = PromotionSchema.extend({
  extra_product: ProductWithCategorySchema.nullable(),
});

export type Promotion = z.infer<typeof PromotionWithCustomerAndProduct>;
