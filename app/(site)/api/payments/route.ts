import { NextRequest } from "next/server";
import { z } from "zod";
import handleRequest from "../util/handleRequest";
import payOrder from "../../sql/payments/payOrder";
import getOrdersWithPayments from "../../sql/payments/getOrdersWithPayments";
import { NoContentSchema, PayOrderSchema } from "../../models";

export const paymentSchemas = {
  payOrder: PayOrderSchema,
  getOrdersWithPayments: NoContentSchema,
};

const POST_ACTIONS = new Map([["payOrder", { func: payOrder, schema: paymentSchemas.payOrder }]]);

const GET_ACTIONS = new Map([
  ["getOrdersWithPayments", { func: getOrdersWithPayments, schema: paymentSchemas.getOrdersWithPayments }],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}
