import { CategorySchema, OptionSchema, ProductSchema } from "@/prisma/generated/zod";
import { z } from "zod";

export const ProductWithRelationsSchema = ProductSchema.extend({
  category: CategorySchema.extend({
    options: z.array(OptionSchema),
  }),
  options: z.array(OptionSchema),
});
