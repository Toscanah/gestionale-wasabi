import { ActionsMapRecord } from "../../lib/api/createHandler";
import payOrder from "../../lib/db/payments/payOrder";
import getOrdersWithPayments from "../../lib/db/payments/getOrdersWithPayments";
import getRomanPaymentsByOrder from "../../lib/db/payments/getRomanPaymentsByOrder";
import { getOrdersWithPaymentsSplitted } from "../../lib/db/payments/getOrdersWithPaymentsSplitted";
import analyzePaymentScopes from "../../lib/db/analyzePaymentScopes";
import applyPaymentScopes from "../../lib/db/applyPaymentScopes";
import { PAYMENT_SCHEMAS } from "../../lib/shared/schemas/payment";

const POST_ACTIONS = new Map([
  ["payOrder", { func: payOrder, schema: PAYMENT_SCHEMAS.payOrder }],
  [
    "getOrdersWithPayments",
    { func: getOrdersWithPayments, schema: PAYMENT_SCHEMAS.getOrdersWithPayments },
  ],
]);

const GET_ACTIONS = new Map([
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

export const PAYMENT_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  GET: GET_ACTIONS,
};
