import { z } from "zod";
import { AnyOrderSchema, ProductInOrderWithOptionsSchema } from "../.";
import {
  AddressSchema,
  CategorySchema,
  CustomerSchema,
  OptionSchema,
  PaymentSchema,
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

export const CreateCustomerSchema = CustomerSchema.omit({ id: true, phone_id: true, active: true });

export const NoContentSchema = z.object({});

export const UpdateAddressSchema = AddressSchema.omit({ active: true });

export const CreateAddressSchema = AddressSchema.omit({ id: true, active: true });
