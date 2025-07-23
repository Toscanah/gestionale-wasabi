import { z } from "zod";
import {
  createInputSchema,
  NoContentSchema,
  ToggleDeleteObjectSchema,
  updateInputSchema,
  wrapSchema,
} from "./common";
import { OrderSchema, ProductSchema } from "@/prisma/generated/zod";
import { ProductInOrderWithOptionsSchema } from "../models/Product";
import TimeScopeFilter from "../../../components/filters/shift/TimeScope";
import { ShiftType } from "../enums/Shift";

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
    time: z.object({
      timeScope: z.nativeEnum(TimeScopeFilter),
      from: z
        .preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date())
        .optional(),
      to: z
        .preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date())
        .optional(),
    }),
    shift: z.nativeEnum(ShiftType),
    categoryId: z.number().optional(),
  }),
});

export type GetProductsWithStatsInput = z.infer<typeof GetProductsWithStatsSchema>;

export const UpdateAdditionalNoteSchema = z.object({
  note: z.string(),
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
  targetOrderId: z.number(),
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

export const PRODUCT_SCHEMAS = {
  getProducts: NoContentSchema,
  updateAdditionalNote: UpdateAdditionalNoteSchema,
  createNewProduct: CreateProductSchema,
  updateProduct: UpdateProductSchema,
  addProductToOrder: AddProductToOrderSchema,
  updateProductInOrder: UpdateProductInOrderSchema,
  addProductsToOrder: AddProductsToOrderSchema,
  updateProductOptionsInOrder: UpdateProductOptionsInOrderSchema,
  toggleProduct: ToggleDeleteObjectSchema,
  updatePrintedAmounts: UpdatePrintedAmountsSchema,
  deleteProductsFromOrder: DeleteProductsFromOrderSchema,
  getProductsWithStats: GetProductsWithStatsSchema,
};
