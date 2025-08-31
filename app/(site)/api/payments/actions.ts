import { ActionsMapRecord } from "../../lib/api/createHandler";
import payOrder from "../../lib/db/payments/payOrder";
import getOrdersWithPayments from "../../lib/db/orders/getOrdersWithPayments";
import getRomanPaymentsByOrder from "../../lib/db/payments/getRomanPaymentsByOrder";
import { getOrdersWithPaymentsSplitted } from "../../lib/db/payments/getOrdersWithPaymentsSplitted";
import analyzePaymentScopes from "../../lib/db/analyzePaymentScopes";
import applyPaymentScopes from "../../lib/db/applyPaymentScopes";
import { PAYMENT_REQUESTS } from "../../lib/shared/schemas/payment";

const POST_ACTIONS = new Map([
  ["payOrder", { func: payOrder, schema: PAYMENT_REQUESTS.payOrder }],
]);

const GET_ACTIONS = new Map([
  [
    "getOrdersWithPaymentsSplitted",
    { func: getOrdersWithPaymentsSplitted, schema: PAYMENT_REQUESTS.getOrdersWithPaymentsSplitted },
  ],
  [
    "getRomanPaymentsByOrder",
    { func: getRomanPaymentsByOrder, schema: PAYMENT_REQUESTS.getRomanPaymentsByOrder },
  ],
  [
    "analyzePaymentScopes",
    { func: applyPaymentScopes, schema: PAYMENT_REQUESTS.analyzePaymentScopes },
  ],
]);

export const PAYMENT_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  GET: GET_ACTIONS,
};
