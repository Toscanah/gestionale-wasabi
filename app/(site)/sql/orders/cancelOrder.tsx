import prisma from "../db";

export default async function cancelOrder(orderId: number) {
  return await prisma.order.update({
    where: { id: orderId },
    data: { state: "CANCELLED" },
  });
}
