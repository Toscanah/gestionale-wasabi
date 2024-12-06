import { OrderType } from "@prisma/client";
import prisma from "../db";

export default async function updateOrderTime(time: string, orderId: number) {
  const baseOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { type: true },
  });

  if (!baseOrder) return;

  const when = time?.toLowerCase() === "Prima possibile" ? "immediate" : time;
  const updateData = { data: { when }, where: { order_id: orderId } };

  await prisma.order.update({
    where: { id: orderId },
    data: { isReceiptPrinted: false },
  });

  return baseOrder.type === "PICK_UP"
    ? prisma.pickupOrder.update(updateData)
    : prisma.homeOrder.update(updateData);
}
