import { NextRequest } from "next/server";
import handleRequest from "../../lib/api/handleRequest";
import payOrder from "../../lib/db/payments/payOrder";
import getOrdersWithPayments from "../../lib/db/payments/getOrdersWithPayments";
import getRomanPaymentsByOrder from "../../lib/db/payments/getRomanPaymentsByOrder";
import { getOrdersWithPaymentsSplitted } from "../../lib/db/payments/getOrdersWithPaymentsSplitted";
import { PAYMENT_SCHEMAS } from "../../lib/shared/schemas/payment";
import analyzePaymentScopes from "../../lib/db/analyzePaymentScopes";
import applyPaymentScopes from "../../lib/db/applyPaymentScopes";

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
