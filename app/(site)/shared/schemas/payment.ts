import { PaymentSchema } from "@/prisma/generated/zod";
import { NoContentSchema } from "./common";
import { z } from "zod";
import { ProductInOrderWithOptionsSchema } from "../models/Product";

export const PayOrderSchema = z.object({
  payments: z.array(PaymentSchema.omit({ id: true, created_at: true })),
  productsToPay: z.array(ProductInOrderWithOptionsSchema),
});

export const GetRomanPaymentsByOrderSchema = z.object({
  orderId: z.number(),
  amount: z.number(),
});

export const PAYMENT_SCHEMAS = {
  payOrder: PayOrderSchema,
  getOrdersWithPayments: NoContentSchema,
  getOrdersWithPaymentsSplitted: NoContentSchema,
  getRomanPaymentsByOrder: GetRomanPaymentsByOrderSchema,
};
