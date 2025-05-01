import { QuickPaymentOption } from "@prisma/client";
import prisma from "../db";
import getOrderById from "./getOrderById";
import { HomeOrder } from "@shared";

export default async function updateOrderPayment({
  orderId,
  payment,
}: {
  orderId: number;
  payment: QuickPaymentOption;
}): Promise<HomeOrder> {
  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });

  const homeOrder = await prisma.homeOrder.findUnique({
    where: { order_id: orderId },
    select: { id: true },
  });

  if (!homeOrder) {
    throw new Error("Order not found");
  }

  await prisma.homeOrder.update({
    where: { order_id: orderId },
    data: { payment },
  });

  return (await getOrderById({orderId})) as HomeOrder;
}
