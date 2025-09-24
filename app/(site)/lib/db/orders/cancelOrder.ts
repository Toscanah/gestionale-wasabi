import prisma from "../db";
import { cancelProductInOrder } from "../products/product-in-order/cancelProductInOrder";
import { OrderStatus } from "@prisma/client";
import { OrderContracts } from "../../shared";
import { getOrderById } from "./getOrderById";

export default async function cancelOrder({
  orderId,
  cooked = false,
}: OrderContracts.Cancel.Input): Promise<OrderContracts.Cancel.Output> {
  const productsInOrder = await prisma.productInOrder.findMany({
    where: {
      order_id: orderId,
    },
    include: {
      options: true,
    },
  });

  await Promise.all(
    productsInOrder.map((pio) =>
      cancelProductInOrder({
        tx: prisma,
        pio,
        cooked,
      })
    )
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
    data: { status: OrderStatus.CANCELLED },
  });

  return await getOrderById({ orderId });
}
