import prisma from "../prisma";
import { cancelProductInOrder } from "../products/product-in-order/cancelProductInOrder";
import { OrderStatus } from "@/prisma/generated/client/enums";
import { OrderContracts } from "../../shared";
import { getOrderById } from "./getOrderById";

export default async function cancelOrder({
  orderId,
  cooked = false,
  hardCancel = false,
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

  if (hardCancel) {
    const order = await getOrderById({ orderId });
    // HARD DELETE: Remove the order record and its specialized type relations
    // Prisma delete will fail if child relations (TableOrder/HomeOrder)
    // aren't set to Cascade. We manually ensure they are gone.
    await prisma.tableOrder.deleteMany({ where: { id: orderId } });
    await prisma.homeOrder.deleteMany({ where: { id: orderId } });
    await prisma.pickupOrder.deleteMany({ where: { id: orderId } });

    await prisma.order.delete({
      where: { id: orderId },
    });

    return { ...order, status: OrderStatus.CANCELLED };
  } else {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELLED },
    });

    return await getOrderById({ orderId });
  }
}
