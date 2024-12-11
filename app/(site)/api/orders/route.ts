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
import { OrderType } from "@prisma/client";
import createSubOrder from "../../sql/orders/createSubOrder";
import updatePrintedFlag from "../../sql/orders/updatePrintedFlag";
import deleteOrdersInBulk from "../../sql/orders/deleteOrdersInBulk";
import handleAction from "../util/handleAction";

const GET_ACTIONS = {
  getOrdersByType: async (params: URLSearchParams) =>
    getOrdersByType(params.get("type") as OrderType),
};

const POST_ACTIONS = {
  updateDiscount: async (content: any) => updateDiscount(content.orderId, content.discount),
  updateOrderNotes: async (content: any) =>
    updateOrderNotes(content.orderId, content.quickPaymentOption),
  createTableOrder: async (content: any) => createTableOrder(content),
  createPickupOrder: async (content: any) => createPickupOrder(content),
  createHomeOrder: async (content: any) => createHomeOrder(content),
  updateOrderTime: async (content: any) => updateOrderTime(content.time, content.orderId),
  cancelOrder: async (content: any) => cancelOrder(content.orderId, content.cooked),
  createSubOrder: async (content: any) => createSubOrder(content.parentOrder, content.products),
  updatePrintedFlag: async (content: any) => updatePrintedFlag(content.orderId),
};

const DELETE_ACTIONS = {
  deleteOrdersInBulk: async (content: any) => deleteOrdersInBulk(content.ordersId),
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const action = params.get("action") ?? "";
  return handleAction(GET_ACTIONS, action, params);
}

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);
  return handleAction(POST_ACTIONS, action, content);
}

export async function DELETE(request: NextRequest) {
  const { action, content } = await getRequestBody(request);
  return handleAction(DELETE_ACTIONS, action, content);
}
