import { OrderContract, TableOrder } from "@/app/(site)/lib/shared";
import prisma from "../../db";
import getOrderById from "../getOrderById";

export default async function updateOrderTablePpl({
  orderId,
  people,
}: OrderContract["Requests"]["UpdateOrderTablePpl"]): Promise<TableOrder> {
  await prisma.tableOrder.update({
    where: { id: orderId },
    data: { people },
  });

  return (await getOrderById({ orderId })) as TableOrder;
}
