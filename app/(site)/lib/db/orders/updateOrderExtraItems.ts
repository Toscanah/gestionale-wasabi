import { OrderContracts } from "../../shared";
import prisma from "../db";
import { getOrderById } from "./getOrderById";

export default async function updateOrderExtraItems({
  orderId,
  items,
  value,
}: OrderContracts.UpdateExtraItems.Input): Promise<OrderContracts.UpdateExtraItems.Output> {
  const newValue = value === null || value < 0 ? null : value;

  await prisma.order.update({
    where: { id: orderId },
    data: { [items]: newValue },
  });

  return await getOrderById({ orderId: orderId });
}
