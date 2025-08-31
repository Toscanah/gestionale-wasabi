import { PaymentSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { ProductInOrderWithOptionsSchema } from "../models/product";
import { ApiContract } from "../types/api-contract";
import { OrderType } from "@prisma/client";
import { ShiftFilterValue } from "../enums/shift";
import { NoContentRequestSchema } from "./common/no-content";
import { OrderWithPaymentsAndTotalsSchema } from "../models/order";
import { PaginationRequestSchema, PaginationResponseSchema } from "./common/pagination";

export const PayOrderRequestSchema = z.object({
  payments: z.array(PaymentSchema.omit({ id: true, created_at: true, payment_group_code: true })),
  productsToPay: z.array(ProductInOrderWithOptionsSchema),
});

export const GetRomanPaymentsByOrderRequestSchema = z.object({
  orderId: z.number(),
});

export const PAYMENT_REQUESTS = {
  payOrder: PayOrderRequestSchema,
  getOrdersWithPaymentsSplitted: NoContentRequestSchema,
  getRomanPaymentsByOrder: GetRomanPaymentsByOrderRequestSchema,
  analyzePaymentScopes: NoContentRequestSchema,
};

export const PAYMENT_RESPONSES = {};

export type PaymentContract = ApiContract<typeof PAYMENT_REQUESTS, typeof PAYMENT_RESPONSES>;
