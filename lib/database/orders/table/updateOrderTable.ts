import { OrderType } from "@/prisma/generated/client/enums";
import { OrderContracts, TableOrder } from "@/lib/shared";
import prisma from "../../prisma";
import { getOrderById } from "../getOrderById";

export default async function updateOrderTable({
  table,
  orderId,
}: OrderContracts.UpdateTable.Input): Promise<OrderContracts.UpdateTable.Output> {
  const orderToUpdate = await getOrderById({ orderId });

  if (!orderToUpdate) {
    throw new Error("Order not found");
  }

  await prisma.tableOrder.update({
    where: { id: orderId },
    data: { table },
  });

  return await getOrderById({ orderId, type: OrderType.TABLE });
}
