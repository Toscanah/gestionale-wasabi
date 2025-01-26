import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updateOrderNotes(orderId: number, notes: string) {
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
    data: { notes },
  });

  return await getOrderById(orderId);
}