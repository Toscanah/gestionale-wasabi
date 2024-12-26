import createTableOrder from "@/app/(site)/sql/orders/createTableOrder";
import { NextRequest } from "next/server";
import getOrdersByType from "../../sql/orders/getOrdersByType";
import createPickupOrder from "../../sql/orders/createPickupOrder";
import createHomeOrder from "../../sql/orders/createHomeOrder";
import updateOrderTime from "../../sql/orders/updateOrderTime";
import cancelOrder from "../../sql/orders/cancelOrder";
import updateOrderNotes from "../../sql/orders/updateOrderNotes";
import updateDiscount from "../../sql/orders/updateDiscount";
import { OrderType } from "@prisma/client";
import createSubOrder from "../../sql/orders/createSubOrder";
import updatePrintedFlag from "../../sql/orders/updatePrintedFlag";
import deleteOrdersInBulk from "../../sql/orders/deleteOrdersInBulk";
import deleteEverything from "../../sql/deleteEverything";
import { z } from "zod";
import { CreateSubOrderSchema, NoContentSchema } from "../../models";
import handleRequest from "../util/handleRequest";
import joinTableOrders from "../../sql/orders/joinTableOrders";
import updateTable from "../../sql/orders/updateTable";
import getOrderById from "../../sql/orders/getOrderById";
import dummy from "../../sql/dummy";

export const orderSchemas = {
  getOrderById: z.object({
    orderId: z.number(),
    variant: z.string().default("onlyPaid"),
  }),
  getOrdersByType: z.object({
    type: z.nativeEnum(OrderType),
  }),
  updateDiscount: z.object({
    orderId: z.number(),
    discount: z.number().optional(),
  }),
  updateOrderNotes: z.object({
    orderId: z.number(),
    quickPaymentOption: z.string(),
  }),
  createTableOrder: z.object({
    table: z.string(),
    people: z.number(),
    resName: z.string().optional(),
  }),
  createPickupOrder: z.object({
    name: z.string(),
    when: z.string(),
    phone: z.string(),
  }),
  createHomeOrder: z.object({
    customerId: z.number(),
    addressId: z.number(),
    notes: z.string(),
    contactPhone: z.string(),
  }),
  updateOrderTime: z.object({
    time: z.string(),
    orderId: z.number(),
  }),
  cancelOrder: z.object({
    orderId: z.number(),
    cooked: z.boolean().optional().default(false),
  }),
  createSubOrder: CreateSubOrderSchema,
  updatePrintedFlag: z.object({
    orderId: z.number(),
  }),
  deleteOrdersInBulk: z.object({
    ordersId: z.array(z.number()),
  }),
  deleteEverything: NoContentSchema,
  joinTableOrders: z.object({
    tableToJoin: z.string(),
    originalOrderId: z.number(),
  }),
  updateTable: z.object({
    table: z.string(),
    orderId: z.number(),
  }),
  dummy: NoContentSchema,
};

const GET_ACTIONS = new Map([
  ["getOrdersByType", { func: getOrdersByType, schema: orderSchemas.getOrdersByType }],
  ["getOrderById", { func: getOrderById, schema: orderSchemas.getOrderById }],
]);

const POST_ACTIONS = new Map([
  ["dummy", { func: dummy, schema: orderSchemas.dummy }],
  ["updateDiscount", { func: updateDiscount, schema: orderSchemas.updateDiscount }],
  ["updateOrderNotes", { func: updateOrderNotes, schema: orderSchemas.updateOrderNotes }],
  ["createTableOrder", { func: createTableOrder, schema: orderSchemas.createTableOrder }],
  ["createPickupOrder", { func: createPickupOrder, schema: orderSchemas.createPickupOrder }],
  ["createHomeOrder", { func: createHomeOrder, schema: orderSchemas.createHomeOrder }],
  ["updateOrderTime", { func: updateOrderTime, schema: orderSchemas.updateOrderTime }],
  ["cancelOrder", { func: cancelOrder, schema: orderSchemas.cancelOrder }],
  ["createSubOrder", { func: createSubOrder, schema: orderSchemas.createSubOrder }],
  ["updatePrintedFlag", { func: updatePrintedFlag, schema: orderSchemas.updatePrintedFlag }],
  ["joinTableOrders", { func: joinTableOrders, schema: orderSchemas.joinTableOrders }],
  ["updateTable", { func: updateTable, schema: orderSchemas.updateTable }],
]);

const DELETE_ACTIONS = new Map([
  ["deleteOrdersInBulk", { func: deleteOrdersInBulk, schema: orderSchemas.deleteOrdersInBulk }],
  ["deleteEverything", { func: deleteEverything, schema: orderSchemas.deleteEverything }],
]);

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}
