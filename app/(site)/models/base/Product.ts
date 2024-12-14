import { ProductInOrderSchema, ProductSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { CategoryWithOptionsSchema,OptionInProductOrderWithOptionSchema } from "./..";

export const ProductWithCategorySchema = ProductSchema.extend({
  category: CategoryWithOptionsSchema.nullable(),
});

export const ProductInOrderWithOptionsSchema = ProductInOrderSchema.extend({
  product: ProductWithCategorySchema,
  options: z.array(OptionInProductOrderWithOptionSchema),
});

export type ProductInOrder = z.infer<typeof ProductInOrderWithOptionsSchema>;
export type Product = z.infer<typeof ProductWithCategorySchema>;
