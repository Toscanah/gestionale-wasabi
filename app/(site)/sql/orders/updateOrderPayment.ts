import { QuickPaymentOption } from "@prisma/client";
import prisma from "../db";
import getOrderById from "./getOrderById";
import { AnyOrder } from "../../models";

export default async function updateOrderPayment(
  orderId: number,
  payment: QuickPaymentOption
): Promise<AnyOrder> {
  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });

  const homeOrder = await prisma.homeOrder.findUnique({
    where: { order_id: orderId },
    select: { notes: true },
  });

  if (!homeOrder) {
    throw new Error("Order not found");
  }

  await prisma.homeOrder.update({
    where: { order_id: orderId },
    data: { payment },
  });

  return await getOrderById(orderId);
}
