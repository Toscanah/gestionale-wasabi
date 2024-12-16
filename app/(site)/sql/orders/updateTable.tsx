import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updateTable(table: string, orderId: number) {
  const orderToUpdate = await getOrderById(orderId);

  if (!orderToUpdate) {
    throw new Error("Order not found");
  }

  await prisma.tableOrder.update({
    where: { order_id: orderId },
    data: { table },
  });

  return await getOrderById(orderId);
}
