import { z } from "zod";
import { AnyOrderSchema, CategoryWithOptionsSchema, ProductInOrderWithOptionsSchema } from "../.";
import {
  AddressSchema,
  CategorySchema,
  CustomerSchema,
  OptionSchema,
  PaymentSchema,
  ProductSchema,
} from "@/prisma/generated/zod";
import { TimeFilter } from "../../sql/products/getProductsWithStats";

export const CreateSubOrderSchema = z.object({
  parentOrder: AnyOrderSchema,
  products: z.array(ProductInOrderWithOptionsSchema),
  isReceiptPrinted: z.boolean(),
});

export const PayOrderSchema = z.object({
  payments: z.array(PaymentSchema.omit({ id: true, created_at: true })),
  productsToPay: z.array(ProductInOrderWithOptionsSchema),
});

export const UpdateOptionsOfCategorySchema = z.object({
  category: CategorySchema,
  options: z.array(OptionSchema),
});

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  phone_id: true,
  name: true,
  surname: true,
  active: true,
  score: true,
  print_review_qr: true,
}).extend({ phone: z.string() });

export const UpdateCustomerSchema = CustomerSchema.omit({
  score: true,
  print_review_qr: true,
}).extend({ phone: z.string() });

export const NoContentSchema = z.object({});

export const UpdateAddressSchema = AddressSchema.omit({ active: true });

export const CreateAddressSchema = AddressSchema.omit({ id: true }).partial({ active: true });

export const CreateProductSchema = ProductSchema.omit({ id: true }).partial({
  category_id: true,
  rice: true,
});

export const UpdateProductSchema = ProductSchema.omit({ active: true }).partial({
  category_id: true,
});

export const CreateCategorySchema = CategoryWithOptionsSchema.omit({ id: true }).partial({
  options: true,
});

export const UpdateCategorySchema = CategoryWithOptionsSchema.omit({ active: true });

export const CreateOptionSchema = OptionSchema.omit({ id: true });

export const UpdateOptionSChema = OptionSchema.omit({ active: true });

export const GetProductsWithStatsSchema = z.object({
  timeFilter: z.nativeEnum(TimeFilter),
  from: z.date().optional(),
  to: z.date().optional(),
});

export const SendMarketingToCustomersSchema = z.object({
  customerIds: z.array(z.number()),
  marketingId: z.number(),
});
