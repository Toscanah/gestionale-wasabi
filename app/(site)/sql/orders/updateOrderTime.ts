import { OrderType } from "@prisma/client";
import prisma from "../db";
import getOrderById from "./getOrderById";
import { AnyOrder } from "@shared"
;

export default async function updateOrderTime(
  time: string,
  orderId: number
): Promise<AnyOrder> {
  const baseOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { type: true },
  });

  if (!baseOrder) {
    throw new Error(`Order with id ${orderId} not found`);
  }

  const when = time?.toLowerCase() === "Prima possibile" ? "immediate" : time;
  const updateData = { data: { when }, where: { order_id: orderId } };

  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });

  if (baseOrder.type === OrderType.PICKUP) {
    await prisma.pickupOrder.update(updateData);
  } else {
    await prisma.homeOrder.update(updateData);
  }

  return await getOrderById(orderId);
}
