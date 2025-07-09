import { AnyOrder } from "@shared";
import prisma from "../db";
import getOrderById from "./getOrderById";
import { ProductInOrderState } from "@prisma/client";
import { cancelProductInOrder } from "../products/product-in-order/cancelProductInOrder";

export default async function cancelOrder({
  orderId,
  cooked = false,
}: {
  orderId: number;
  cooked?: boolean;
}): Promise<AnyOrder> {
  const productsInOrder = await prisma.productInOrder.findMany({
    where: {
      order_id: orderId,
    },
    include: {
      options: true,
    },
  });

  productsInOrder.forEach(
    async (pio) =>
      await cancelProductInOrder({
        tx: prisma,
        pio,
        cooked,
      })
  );

  await prisma.engagement.updateMany({
    where: {
      order_id: orderId,
    },
    data: {
      enabled: true,
    },
  });

  await prisma.payment.deleteMany({
    where: {
      order_id: orderId,
    },
  });

  // Cancel the order
  await prisma.order.update({
    where: { id: orderId },
    data: { state: "CANCELLED" },
  });

  return getOrderById({ orderId });
}
