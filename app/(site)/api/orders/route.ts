import createTableOrder from "@/app/(site)/sql/orders/createTableOrder";
import { NextRequest } from "next/server";
import getOrdersByType from "../../sql/orders/getOrdersByType";
import createPickupOrder from "../../sql/orders/createPickupOrder";
import createHomeOrder from "../../sql/orders/createHomeOrder";
import getRequestBody from "../../util/functions/getRequestBody";
import updateOrderTime from "../../sql/orders/updateOrderTime";
import cancelOrder from "../../sql/orders/cancelOrder";
import updateOrderNotes from "../../sql/orders/updateOrderNotes";
import updateDiscount from "../../sql/orders/updateDiscount";
import { HomeOrder, OrderType } from "@prisma/client";
import createSubOrder from "../../sql/orders/createSubOrder";
import updatePrintedFlag from "../../sql/orders/updatePrintedFlag";
import deleteOrdersInBulk from "../../sql/orders/deleteOrdersInBulk";
import deleteEverything from "../../sql/deleteEverything";
import { z } from "zod";
import executeAction from "../util/executeAction";
import { AnyOrder } from "../../types/PrismaOrders";
import { CustomerWithDetails } from "../../types/CustomerWithDetails";
import {
  HomeOrderWithRelationsSchema,
  OrderWithRelationsSchema,
  PickupOrderWithRelationsSchema,
  TableOrderWithRelationsSchema,
} from "@/prisma/generated/zod";

const schemas = {
  getOrdersByType: z.object({
    type: z.nativeEnum(OrderType),
  }),
  updateDiscount: z.object({
    orderId: z.number(),
    discount: z.number(),
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
    phoe: z.string().optional(),
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
  createSubOrder: z.object({
    parentOrder: HomeOrderWithRelationsSchema.or(PickupOrderWithRelationsSchema).or(
      TableOrderWithRelationsSchema
    ),
  }),
  updatePrintedFlag: z.object({
    orderId: z.number(),
  }),
  deleteOrdersInBulk: z.object({
    ordersId: z.array(z.number()),
  }),
  deleteEverything: z.object({}),
  prova: OrderWithRelationsSchema,
};

const GET_ACTIONS = new Map([
  ["getOrdersByType", { func: getOrdersByType, schema: schemas.getOrdersByType }],
]);

const POST_ACTIONS = new Map([
  [
    "prova",
    {
      func: async (order: HomeOrder) => {
        console.log("Oridine ricevuto", order);
        return null;
      },
      schema: schemas.prova,
    },
  ],
  ["updateDiscount", { func: updateDiscount, schema: schemas.updateDiscount }],
  ["updateOrderNotes", { func: updateOrderNotes, schema: schemas.updateOrderNotes }],
  ["createTableOrder", { func: createTableOrder, schema: schemas.createTableOrder }],
  ["createPickupOrder", { func: createPickupOrder, schema: schemas.createPickupOrder }],
  ["createHomeOrder", { func: createHomeOrder, schema: schemas.createHomeOrder }],
  ["updateOrderTime", { func: updateOrderTime, schema: schemas.updateOrderTime }],
  ["cancelOrder", { func: cancelOrder, schema: schemas.cancelOrder }],
  ["createSubOrder", { func: createSubOrder, schema: schemas.createSubOrder }],
  ["updatePrintedFlag", { func: updatePrintedFlag, schema: schemas.updatePrintedFlag }],
]);

const DELETE_ACTIONS = new Map([
  ["deleteOrdersInBulk", { func: deleteOrdersInBulk, schema: schemas.deleteOrdersInBulk }],
  ["deleteEverything", { func: deleteEverything, schema: schemas.deleteEverything }],
]);

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const action = params.get("action") ?? "";
  const content = Object.fromEntries(
    Array.from(params.entries()).filter(([key]) => key !== "action")
  );
  return executeAction(GET_ACTIONS, action, content);
}

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);
  return executeAction(POST_ACTIONS, action, content);
}

export async function DELETE(request: NextRequest) {
  const { action, content } = await getRequestBody(request);
  return executeAction(DELETE_ACTIONS, action, content);
}
