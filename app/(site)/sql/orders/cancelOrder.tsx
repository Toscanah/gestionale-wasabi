import prisma from "../db";

export default async function cancelOrder(orderId: number, cooked: boolean = false) {
  await prisma.productInOrder.updateMany({
    where: {
      order_id: orderId,
    },
    data: {
      state: cooked ? "DELETED_COOKED" : "DELETED_UNCOOKED",
    },
  });

  return await prisma.order.update({
    where: { id: orderId },
    data: { state: "CANCELLED" },
  });
}
