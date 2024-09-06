import { OrderType } from "@prisma/client";
import prisma from "../db";

export default async function updateOrderTime(time: string, orderId: number) {
  const baseOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { type: true },
  });

  if (!baseOrder) return;

  const when = time?.toLowerCase() === "subito" ? "immediate" : time;

  const updateData = { data: { when }, where: { order_id: orderId } };

  if (baseOrder.type === OrderType.PICK_UP) {
    return prisma.pickupOrder.update(updateData);
  } else if (baseOrder.type === OrderType.TO_HOME) {
    return prisma.homeOrder.update(updateData);
  }
}
