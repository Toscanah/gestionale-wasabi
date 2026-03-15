import { OrderType } from "@/prisma/generated/client/enums";
import { OrderContracts } from "@/lib/shared";
import prisma from "../../prisma";
import { getOrderById } from "../getOrderById";

export default async function updateOrderTablePpl({
  orderId,
  people,
}: OrderContracts.UpdateTablePpl.Input): Promise<OrderContracts.UpdateTablePpl.Output> {
  await prisma.tableOrder.update({
    where: { id: orderId },
    data: { people },
  });

  return await getOrderById({ orderId, type: OrderType.TABLE });
}
