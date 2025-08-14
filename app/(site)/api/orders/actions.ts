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
import { ORDER_SCHEMAS } from "../../lib/shared/schemas/order";
import createTableOrder from "../../lib/db/orders/table/createTableOrder";
import createPickupOrder from "../../lib/db/orders/pickup/createPickupOrder";
import createHomeOrder from "../../lib/db/orders/home/createHomeOrder";
import createSubOrder from "../../lib/db/orders/sub/createSubOrder";
import joinTableOrders from "../../lib/db/orders/table/joinTableOrders";
import updateOrderTable from "../../lib/db/orders/table/updateOrderTable";
import updateOrderTablePpl from "../../lib/db/orders/table/updateOrderTablePpl";

const GET_ACTIONS = new Map([
  ["getOrdersByType", { func: getOrdersByType, schema: ORDER_SCHEMAS.getOrdersByType }],
  ["getOrderById", { func: getOrderById, schema: ORDER_SCHEMAS.getOrderById }],
]);

const POST_ACTIONS = new Map([
  ["createTableOrder", { func: createTableOrder, schema: ORDER_SCHEMAS.createTableOrder }],
  ["createPickupOrder", { func: createPickupOrder, schema: ORDER_SCHEMAS.createPickupOrder }],
  ["createHomeOrder", { func: createHomeOrder, schema: ORDER_SCHEMAS.createHomeOrder }],
  ["createSubOrder", { func: createSubOrder, schema: ORDER_SCHEMAS.createSubOrder }],
]);

const PATCH_ACTIONS = new Map([
  ["updateOrderDiscount", { func: updateOrderDiscount, schema: ORDER_SCHEMAS.updateOrderDiscount }],
  ["updateOrderTime", { func: updateOrderTime, schema: ORDER_SCHEMAS.updateOrderTime }],
  ["updateOrderPrintedFlag", { func: updateOrderPrintedFlag, schema: ORDER_SCHEMAS.updateOrderPrintedFlag }],
  ["updateOrderTable", { func: updateOrderTable, schema: ORDER_SCHEMAS.updateOrderTable }],
  ["updateOrderPaymentStatus", { func: updateOrderPaymentStatus, schema: ORDER_SCHEMAS.updateOrderPaymentStatus }],
  ["updateOrderShift", { func: updateOrderShift, schema: ORDER_SCHEMAS.updateOrderShift }],
  [
    "updateOrderExtraItems",
    { func: updateOrderExtraItems, schema: ORDER_SCHEMAS.updateOrderExtraItems },
  ],
  ["joinTableOrders", { func: joinTableOrders, schema: ORDER_SCHEMAS.joinTableOrders }],
  ["fixOrdersShift", { func: fixOrdersShift, schema: ORDER_SCHEMAS.fixOrdersShift }],
  ["updateOrderTablePpl", { func: updateOrderTablePpl, schema: ORDER_SCHEMAS.updateOrderTablePpl }],
]);

const DELETE_ACTIONS = new Map([
  ["cancelOrder", { func: cancelOrder, schema: ORDER_SCHEMAS.cancelOrder }],
  ["cancelOrdersInBulk", { func: cancelOrdersInBulk, schema: ORDER_SCHEMAS.cancelOrdersInBulk }],
  ["deleteEverything", { func: deleteEverything, schema: ORDER_SCHEMAS.deleteEverything }],
]);

export const ORDER_ACTIONS: ActionsMapRecord = {
  GET: GET_ACTIONS,
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  DELETE: DELETE_ACTIONS,
};
