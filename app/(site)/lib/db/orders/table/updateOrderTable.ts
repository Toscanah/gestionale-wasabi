import { OrderSchemaInputs, TableOrder } from "../../../shared";
import prisma from "../../db";
import getOrderById from "../getOrderById";

export default async function updateOrderTable({
  table,
  orderId,
}: OrderSchemaInputs["UpdateOrderTableInput"]): Promise<TableOrder> {
  const orderToUpdate = await getOrderById({ orderId });

  if (!orderToUpdate) {
    throw new Error("Order not found");
  }

  await prisma.tableOrder.update({
    where: { id: orderId },
    data: { table },
  });

  return (await getOrderById({ orderId })) as TableOrder;
}
