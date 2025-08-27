import { PaymentSchema } from "@/prisma/generated/zod";
import { NoContentSchema, PaginationSchema } from "./common";
import { z } from "zod";
import { ProductInOrderWithOptionsSchema } from "../models/Product";
import { SchemaInputs } from "../types/SchemaInputs";
import { OrderType } from "@prisma/client";
import { ShiftType } from "../enums/Shift";

export const PayOrderSchema = z.object({
  payments: z.array(PaymentSchema.omit({ id: true, created_at: true, payment_group_code: true })),
  productsToPay: z.array(ProductInOrderWithOptionsSchema),
});

export const GetRomanPaymentsByOrderSchema = z.object({
  orderId: z.number(),
});

export const GetOrderWithPaymentsSchema = PaginationSchema.extend({
  filters: z.object({
    type: z.nativeEnum(OrderType).optional(),
    shift: z.nativeEnum(ShiftType).optional(),
    timeScope: z.enum(["single", "range"]),
    singleDate: z.coerce.date().optional(),
    rangeDate: z
      .object({
        from: z.coerce.date(),
        to: z.coerce.date(),
      })
      .optional(),
    search: z.string().optional(),
  }),
  summary: z.boolean().optional(),
});

export const PAYMENT_SCHEMAS = {
  payOrder: PayOrderSchema,
  getOrdersWithPayments: GetOrderWithPaymentsSchema,
  getOrdersWithPaymentsSplitted: NoContentSchema,
  getRomanPaymentsByOrder: GetRomanPaymentsByOrderSchema,
  analyzePaymentScopes: NoContentSchema,
};

export type PaymentSchemaInputs = SchemaInputs<typeof PAYMENT_SCHEMAS>;
