import { z } from "zod";

import { OrderSchema, ProductSchema } from "@/prisma/generated/zod";
import { ProductInOrderWithOptionsSchema } from "../models/product";
import { ShiftFilterValue } from "../enums/shift";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";
import { NoContentRequestSchema } from "./common/no-content";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { ApiContract } from "../types/api-contract";
import { PeriodRequestSchema } from "./common/period";

export const CreateProductInputSchema = createInputSchema(ProductSchema).partial({
  category_id: true,
  rice: true,
});

export const UpdateProductInputSchema = updateInputSchema(ProductSchema).partial({
  category_id: true,
});

export const CreateProductSchema = wrapSchema("product", CreateProductInputSchema);

export const UpdateProductSchema = wrapSchema("product", UpdateProductInputSchema);

export const GetProductsWithStatsSchema = z.object({
  filters: z.object({
    period: PeriodRequestSchema,
    shift: z.nativeEnum(ShiftFilterValue).optional(),
    categoryIds: z.array(z.number()).optional(),
  }),
});

export const UpdateProductVariationInOrderSchema = z.object({
  variation: z.string(),
  productInOrderId: z.number(),
});

export const AddProductToOrderSchema = z.object({
  order: OrderSchema,
  productCode: z.string(),
  quantity: z.number(),
});

export const UpdateProductInOrderSchema = z.object({
  orderId: z.number(),
  key: z.string(),
  value: z.any(),
  productInOrder: ProductInOrderWithOptionsSchema,
});

export const AddProductsToOrderSchema = z.object({
  orderId: z.number(),
  products: z.array(ProductInOrderWithOptionsSchema),
});

export const UpdateProductOptionsInOrderSchema = z.object({
  productInOrderId: z.number(),
  optionId: z.number(),
});

export const UpdatePrintedAmountsSchema = wrapSchema("orderId", z.number());

export const DeleteProductsFromOrderSchema = z.object({
  productIds: z.array(z.number()),
  orderId: z.number(),
  cooked: z.boolean().default(false),
});

export const PRODUCT_REQUESTS = {
  getProducts: NoContentRequestSchema,
  updateProductVariationInOrder: UpdateProductVariationInOrderSchema,
  createNewProduct: CreateProductSchema,
  updateProduct: UpdateProductSchema,
  addProductToOrder: AddProductToOrderSchema,
  updateProductInOrder: UpdateProductInOrderSchema,
  addProductsToOrder: AddProductsToOrderSchema,
  updateProductOptionsInOrder: UpdateProductOptionsInOrderSchema,
  toggleProduct: ToggleDeleteEntityRequestSchema,
  updatePrintedAmounts: UpdatePrintedAmountsSchema,
  deleteProductsFromOrder: DeleteProductsFromOrderSchema,
  getProductsWithStats: GetProductsWithStatsSchema,
};

export const PRODUCT_RESPONSES = {};

export type ProductContract = ApiContract<typeof PRODUCT_REQUESTS, typeof PRODUCT_RESPONSES>;
