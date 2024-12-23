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

export const CreateSubOrderSchema = z.object({
  parentOrder: AnyOrderSchema,
  products: z.array(ProductInOrderWithOptionsSchema),
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
}).extend({ phone: z.string() });

export const UpdateCustomerSchema = CustomerSchema.extend({ phone: z.string() });

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
