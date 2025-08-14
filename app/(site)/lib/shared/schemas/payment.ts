import { PaymentSchema } from "@/prisma/generated/zod";
import { NoContentSchema } from "./common";
import { z } from "zod";
import { ProductInOrderWithOptionsSchema } from "../models/Product";
import { SchemaInputs } from "../types/SchemaInputs";

export const PayOrderSchema = z.object({
  payments: z.array(PaymentSchema.omit({ id: true, created_at: true, payment_group_code: true })),
  productsToPay: z.array(ProductInOrderWithOptionsSchema),
});

export const GetRomanPaymentsByOrderSchema = z.object({
  orderId: z.number(),
});

export const PAYMENT_SCHEMAS = {
  payOrder: PayOrderSchema,
  getOrdersWithPayments: NoContentSchema,
  getOrdersWithPaymentsSplitted: NoContentSchema,
  getRomanPaymentsByOrder: GetRomanPaymentsByOrderSchema,
  analyzePaymentScopes: NoContentSchema,
};

export type PaymentSchemaInputs = SchemaInputs<typeof PAYMENT_SCHEMAS>;