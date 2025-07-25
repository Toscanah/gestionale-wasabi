import { ActionsMapRecord } from "../../lib/api/createHandler";
import createTableOrder from "../../lib/db/orders/createTableOrder";
import createPickupOrder from "../../lib/db/orders/createPickupOrder";
import createHomeOrder from "../../lib/db/orders/createHomeOrder";
import createSubOrder from "../../lib/db/orders/createSubOrder";
import updateOrderDiscount from "../../lib/db/orders/updateOrderDiscount";
import updateOrderNotes from "../../lib/db/orders/updateOrderNotes";
import updateOrderTime from "../../lib/db/orders/updateOrderTime";
import updatePrintedFlag from "../../lib/db/orders/updatePrintedFlag";
import joinTableOrders from "../../lib/db/orders/joinTableOrders";
import updateTable from "../../lib/db/orders/updateTable";
import updateOrderPayment from "../../lib/db/orders/updateOrderPayment";
import { updateOrderShift } from "../../lib/db/orders/updateOrderShift";
import { fixOrdersShift } from "../../lib/db/orders/fixOrdersShift";
import updateOrderExtraItems from "../../lib/db/orders/updateOrderExtraItems";
import cancelOrder from "../../lib/db/orders/cancelOrder";
import cancelOrdersInBulk from "../../lib/db/orders/cancelOrdersInBulk";
import deleteEverything from "../../lib/db/deleteEverything";
import getOrdersByType from "../../lib/db/orders/getOrdersByType";
import getOrderById from "../../lib/db/orders/getOrderById";
import updateTablePpl from "../../lib/db/orders/updateTablePpl";
import { ORDER_SCHEMAS } from "../../lib/shared/schemas/order";

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
  ["updateOrderNotes", { func: updateOrderNotes, schema: ORDER_SCHEMAS.updateOrderNotes }],
  ["updateOrderTime", { func: updateOrderTime, schema: ORDER_SCHEMAS.updateOrderTime }],
  ["updatePrintedFlag", { func: updatePrintedFlag, schema: ORDER_SCHEMAS.updatePrintedFlag }],
  ["joinTableOrders", { func: joinTableOrders, schema: ORDER_SCHEMAS.joinTableOrders }],
  ["updateTable", { func: updateTable, schema: ORDER_SCHEMAS.updateTable }],
  ["updateOrderPayment", { func: updateOrderPayment, schema: ORDER_SCHEMAS.updateOrderPayment }],
  ["updateOrderShift", { func: updateOrderShift, schema: ORDER_SCHEMAS.updateOrderShift }],
  [
    "updateOrderExtraItems",
    { func: updateOrderExtraItems, schema: ORDER_SCHEMAS.updateOrderExtraItems },
  ],
  ["fixOrdersShift", { func: fixOrdersShift, schema: ORDER_SCHEMAS.fixOrdersShift }],
  ["updateTablePpl", { func: updateTablePpl, schema: ORDER_SCHEMAS.updateTablePpl }],
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
