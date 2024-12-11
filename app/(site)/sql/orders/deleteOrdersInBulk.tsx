import prisma from "../db";

export default async function deleteOrdersInBulk(ordersId: number[]) {
  await prisma.productInOrder.updateMany({
    where: {
      order_id: {
        in: ordersId,
      },
    },
    data: {
      state: "DELETED_UNCOOKED",
    },
  });

  await prisma.order.updateMany({
    where: {
      id: {
        in: ordersId,
      },
    },
    data: {
      state: "CANCELLED",
    },
  });

  return await prisma.order.findMany({
    where: {
      id: {
        in: ordersId,
      },
    },
  });
}
