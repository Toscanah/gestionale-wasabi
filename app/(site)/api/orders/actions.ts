import { ActionsMapRecord } from "../../lib/api/createHandler";
import updateOrderDiscount from "../../lib/db/orders/updateOrderDiscount";
import updateOrderTime from "../../lib/db/orders/updateOrderTime";
import updateOrderPrintedFlag from "../../lib/db/orders/updateOrderPrintedFlag";
import updateOrderPaymentStatus from "../../lib/db/orders/updateOrderPaymentStatus";
import { updateOrderShift } from "../../lib/db/orders/updateOrderShift";
import { fixOrdersShift } from "../../lib/db/orders/fixOrdersShift";
import updateOrderExtraItems from "../../lib/db/orders/updateOrderExtraItems";
import cancelOrder from "../../lib/db/orders/cancelOrder";
import cancelOrdersInBulk from "../../lib/db/orders/cancelOrdersInBulk";
import deleteEverything from "../../lib/db/deleteEverything";
import getOrdersByType from "../../lib/db/orders/getOrdersByType";
import getOrderById from "../../lib/db/orders/getOrderById";
import { ORDER_REQUESTS } from "../../lib/shared/schemas/order";
import createTableOrder from "../../lib/db/orders/table/createTableOrder";
import createPickupOrder from "../../lib/db/orders/pickup/createPickupOrder";
import createHomeOrder from "../../lib/db/orders/home/createHomeOrder";
import createSubOrder from "../../lib/db/orders/sub/createSubOrder";
import joinTableOrders from "../../lib/db/orders/table/joinTableOrders";
import updateOrderTable from "../../lib/db/orders/table/updateOrderTable";
import updateOrderTablePpl from "../../lib/db/orders/table/updateOrderTablePpl";
import getOrdersWithPayments from "../../lib/db/orders/getOrdersWithPayments";

const GET_ACTIONS = new Map([
  ["getOrdersByType", { func: getOrdersByType, schema: ORDER_REQUESTS.getOrdersByType }],
  ["getOrderById", { func: getOrderById, schema: ORDER_REQUESTS.getOrderById }],
]);

const POST_ACTIONS = new Map([
  ["createTableOrder", { func: createTableOrder, schema: ORDER_REQUESTS.createTableOrder }],
  ["createPickupOrder", { func: createPickupOrder, schema: ORDER_REQUESTS.createPickupOrder }],
  ["createHomeOrder", { func: createHomeOrder, schema: ORDER_REQUESTS.createHomeOrder }],
  ["createSubOrder", { func: createSubOrder, schema: ORDER_REQUESTS.createSubOrder }],
  [
    "getOrdersWithPayments",
    { func: getOrdersWithPayments, schema: ORDER_REQUESTS.getOrdersWithPayments },
  ],
]);

const PATCH_ACTIONS = new Map([
  [
    "updateOrderDiscount",
    { func: updateOrderDiscount, schema: ORDER_REQUESTS.updateOrderDiscount },
  ],
  ["updateOrderTime", { func: updateOrderTime, schema: ORDER_REQUESTS.updateOrderTime }],
  [
    "updateOrderPrintedFlag",
    { func: updateOrderPrintedFlag, schema: ORDER_REQUESTS.updateOrderPrintedFlag },
  ],
  ["updateOrderTable", { func: updateOrderTable, schema: ORDER_REQUESTS.updateOrderTable }],
  [
    "updateOrderPaymentStatus",
    { func: updateOrderPaymentStatus, schema: ORDER_REQUESTS.updateOrderPaymentStatus },
  ],
  ["updateOrderShift", { func: updateOrderShift, schema: ORDER_REQUESTS.updateOrderShift }],
  [
    "updateOrderExtraItems",
    { func: updateOrderExtraItems, schema: ORDER_REQUESTS.updateOrderExtraItems },
  ],
  ["joinTableOrders", { func: joinTableOrders, schema: ORDER_REQUESTS.joinTableOrders }],
  ["fixOrdersShift", { func: fixOrdersShift, schema: ORDER_REQUESTS.fixOrdersShift }],
  [
    "updateOrderTablePpl",
    { func: updateOrderTablePpl, schema: ORDER_REQUESTS.updateOrderTablePpl },
  ],
]);

const DELETE_ACTIONS = new Map([
  ["cancelOrder", { func: cancelOrder, schema: ORDER_REQUESTS.cancelOrder }],
  ["cancelOrdersInBulk", { func: cancelOrdersInBulk, schema: ORDER_REQUESTS.cancelOrdersInBulk }],
  ["deleteEverything", { func: deleteEverything, schema: ORDER_REQUESTS.deleteEverything }],
]);

export const ORDER_ACTIONS: ActionsMapRecord = {
  GET: GET_ACTIONS,
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  DELETE: DELETE_ACTIONS,
};
