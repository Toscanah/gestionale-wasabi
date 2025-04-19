import { CategorySchema, OptionInProductOrderSchema, OptionSchema } from "@/prisma/generated/zod";
import { z } from "zod";

export const OptionWithCategoriesSchema = OptionSchema.extend({
  categories: z.array(
    z.object({
      category: CategorySchema,
    })
  ),
});

export const OptionInProductOrderWithOptionSchema = OptionInProductOrderSchema.extend({
  option: OptionSchema,
});

export type OptionWithCategories = z.infer<typeof OptionWithCategoriesSchema>;
export type OptionInProductOrder = z.infer<typeof OptionInProductOrderWithOptionSchema>;
