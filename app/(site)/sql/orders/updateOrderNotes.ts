import { AnyOrder } from "@shared"
;
import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updateOrderNotes(orderId: number, notes: string): Promise<AnyOrder> {
  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });

  // Check if the order exists in either homeOrder or pickupOrder
  const [homeOrder, pickupOrder] = await Promise.all([
    prisma.homeOrder.findUnique({
      where: { order_id: orderId },
      select: { notes: true },
    }),
    prisma.pickupOrder.findUnique({
      where: { order_id: orderId },
      select: { notes: true },
    }),
  ]);

  if (!homeOrder && !pickupOrder) {
    throw new Error("Order not found");
  }

  // Update the notes in the correct table
  if (homeOrder) {
    await prisma.homeOrder.update({
      where: { order_id: orderId },
      data: { notes },
    });
  } else if (pickupOrder) {
    await prisma.pickupOrder.update({
      where: { order_id: orderId },
      data: { notes },
    });
  }

  return await getOrderById(orderId);
}
