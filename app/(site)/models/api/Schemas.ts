import { z } from "zod";
import { AnyOrderSchema } from "../base/Order";
import { ProductInOrderWithOptionsSchema } from "../base/Product";
import {
  AddressSchema,
  CategorySchema,
  CustomerSchema,
  OptionSchema,
  PaymentSchema,
} from "@/prisma/generated/zod";
import { CategoryWithOptionsSchema } from "../base/Category";

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
