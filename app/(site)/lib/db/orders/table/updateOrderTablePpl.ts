import { OrderContracts, TableOrder } from "../../../shared";
import prisma from "../../db";
import getOrderById from "../getOrderById";

export default async function updateOrderTablePpl({
  orderId,
  people,
}: OrderContracts.UpdateTablePpl.Input): Promise<OrderContracts.UpdateTablePpl.Output> {
  await prisma.tableOrder.update({
    where: { id: orderId },
    data: { people },
  });

  return (await getOrderById({ orderId })) as TableOrder;
}
