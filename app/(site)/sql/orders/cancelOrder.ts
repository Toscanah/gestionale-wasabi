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
  await prisma.productInOrder.updateMany({
    where: {
      order_id: orderId,
    },
    data: {
      state: cooked ? "DELETED_COOKED" : "DELETED_UNCOOKED",
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { state: "CANCELLED" },
  });

  return getOrderById({orderId});
}
