import { TableOrder, UpdateTablePplInput } from "../../shared";
import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updateTablePpl({
  orderId,
  people,
}: UpdateTablePplInput): Promise<TableOrder> {
  await prisma.tableOrder.update({
    where: { order_id: orderId },
    data: { people },
  });

  return (await getOrderById({ orderId })) as TableOrder;
}
