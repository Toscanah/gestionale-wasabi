import { NextRequest } from "next/server";
import { number, z } from "zod";
import handleRequest from "../util/handleRequest";
import payOrder from "../../sql/payments/payOrder";
import getOrdersWithPayments from "../../sql/payments/getOrdersWithPayments";
import { NoContentSchema, PayOrderSchema } from "../../models";
import getRomanPaymentsByOrder from "../../sql/payments/getRomanPaymentsByOrder";

export const paymentSchemas = {
  payOrder: PayOrderSchema,
  getOrdersWithPayments: NoContentSchema,
  getRomanPaymentsByOrder: z.object({
    orderId: z.number(),
    amount: z.string(),
  }),
};

const POST_ACTIONS = new Map([["payOrder", { func: payOrder, schema: paymentSchemas.payOrder }]]);

const GET_ACTIONS = new Map([
  [
    "getOrdersWithPayments",
    { func: getOrdersWithPayments, schema: paymentSchemas.getOrdersWithPayments },
  ],
  [
    "getRomanPaymentsByOrder",
    { func: getRomanPaymentsByOrder, schema: paymentSchemas.getRomanPaymentsByOrder },
  ],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}
