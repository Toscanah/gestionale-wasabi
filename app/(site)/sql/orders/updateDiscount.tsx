import prisma from "../db";

export default async function updateDiscount(orderId: number, discount: number) {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      discount: discount ?? 0,
    },
  });
}
