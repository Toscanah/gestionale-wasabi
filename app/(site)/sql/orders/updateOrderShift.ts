import { Shift } from "@prisma/client";
import prisma from "../db";

export async function updateOrderShift(orderId: number, shift: Shift) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { shift },
  });

  return true;
}
