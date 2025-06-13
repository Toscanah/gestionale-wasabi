import { NextRequest } from "next/server";
import handleRequest from "../util/handleRequest";
import payOrder from "../../sql/payments/payOrder";
import getOrdersWithPayments from "../../sql/payments/getOrdersWithPayments";
import getRomanPaymentsByOrder from "../../sql/payments/getRomanPaymentsByOrder";
import { getOrdersWithPaymentsSplitted } from "../../sql/payments/getOrdersWithPaymentsSplitted";
import { PAYMENT_SCHEMAS } from "../../shared/schemas/payment";
import analyzePaymentScopes from "../../sql/analyzePaymentScopes";
import applyPaymentScopes from "../../sql/applyPaymentScopes";

const POST_ACTIONS = new Map([["payOrder", { func: payOrder, schema: PAYMENT_SCHEMAS.payOrder }]]);

const GET_ACTIONS = new Map([
  [
    "getOrdersWithPayments",
    { func: getOrdersWithPayments, schema: PAYMENT_SCHEMAS.getOrdersWithPayments },
  ],
  [
    "getOrdersWithPaymentsSplitted",
    { func: getOrdersWithPaymentsSplitted, schema: PAYMENT_SCHEMAS.getOrdersWithPaymentsSplitted },
  ],
  [
    "getRomanPaymentsByOrder",
    { func: getRomanPaymentsByOrder, schema: PAYMENT_SCHEMAS.getRomanPaymentsByOrder },
  ],
  [
    "analyzePaymentScopes",
    { func: applyPaymentScopes, schema: PAYMENT_SCHEMAS.analyzePaymentScopes },
  ],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}
