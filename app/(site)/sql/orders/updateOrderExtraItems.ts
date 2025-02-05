import { ExtraItems } from "../../orders/single-order/overview/ExtraItems";
import prisma from "../db";

export default async function updateOrderExtraItems(
  orderId: number,
  items: ExtraItems,
  value: number | null
) {
  const newValue = value === null || value < 0 ? null : value;

  return await prisma.order.update({
    where: { id: orderId },
    data: { [items]: newValue },
  });
}
