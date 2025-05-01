import { TableOrder } from "@shared";
import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updateTable({
  table,
  orderId,
}: {
  table: string;
  orderId: number;
}): Promise<TableOrder> {
  const orderToUpdate = await getOrderById({ orderId });

  if (!orderToUpdate) {
    throw new Error("Order not found");
  }

  await prisma.tableOrder.update({
    where: { order_id: orderId },
    data: { table },
  });

  return (await getOrderById({ orderId })) as TableOrder;
}
