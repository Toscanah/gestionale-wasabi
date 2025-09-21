import { ProductInOrderSchema, ProductSchema } from "@/prisma/generated/schemas";
import { z } from "zod";
import { CategoryWithOptionsSchema } from "./category";
import { OptionInProductOrderWithOptionSchema, OptionStatsOnlySchema } from "./option";

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

export const ProductStatsOnlySchema = z.object({
  productId: z.number(),
  unitsSold: z.number(),
  revenue: z.number(),
  totalRice: z.number(),
  options: z.array(OptionStatsOnlySchema),
});

export const ProductWithStatsSchema = ProductSchema.extend({
  stats: ProductStatsOnlySchema.omit({ productId: true }),
});

export type ProductWithStats = z.infer<typeof ProductWithStatsSchema>;
export type ProductStats = z.infer<typeof ProductStatsOnlySchema>;
export type ProductInOrder = z.infer<typeof ProductInOrderWithOptionsSchema>;
export type Product = z.infer<typeof ProductWithCategorySchema>;
export type MinimalProductInOrder = z.infer<typeof MinimalProductInOrderSchema>;
