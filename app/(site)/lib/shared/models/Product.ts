import { ProductInOrderSchema, ProductSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { CategoryWithOptionsSchema } from "./category";
import { OptionInProductOrderWithOptionSchema } from "./option";

export const ProductWithCategorySchema = ProductSchema.extend({
  category: CategoryWithOptionsSchema.nullable(),
});

export const ProductInOrderWithOptionsSchema = ProductInOrderSchema.extend({
  product: ProductWithCategorySchema,
  options: z.array(OptionInProductOrderWithOptionSchema),
  to_be_printed: z.number().optional(),
});

export const MinimalProductInOrderSchema = ProductInOrderSchema.pick({
  quantity: true,
  frozen_price: true,
  status: true,
  paid_quantity: true,
}).extend({
  product: ProductSchema.pick({ active: true }),
});

export type ProductInOrder = z.infer<typeof ProductInOrderWithOptionsSchema>;
export type Product = z.infer<typeof ProductWithCategorySchema>;
export type MinimalProductInOrder = z.infer<typeof MinimalProductInOrderSchema>;
