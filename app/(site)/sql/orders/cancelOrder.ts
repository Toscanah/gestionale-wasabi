import { AnyOrder } from "@shared";
import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function cancelOrder({
  orderId,
  cooked = false,
}: {
  orderId: number;
  cooked?: boolean;
}): Promise<AnyOrder> {
  // Get all PIOs for the order
  const productsInOrder = await prisma.productInOrder.findMany({
    where: {
      order_id: orderId,
    },
    select: {
      id: true,
      is_paid_fully: true,
    },
  });

  // Filter only unpaid PIOs
  const unpaidPioIds = productsInOrder.filter((pio) => !pio.is_paid_fully).map((pio) => pio.id);

  // Conditionally update only unpaid PIOs
  if (unpaidPioIds.length > 0) {
    await prisma.productInOrder.updateMany({
      where: {
        id: { in: unpaidPioIds },
      },
      data: {
        state: cooked ? "DELETED_COOKED" : "DELETED_UNCOOKED",
      },
    });
  }

  // Cancel the order regardless
  await prisma.order.update({
    where: { id: orderId },
    data: { state: "CANCELLED" },
  });

  return getOrderById({ orderId });
}
