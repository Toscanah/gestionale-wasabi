import prisma from "../db";

export default async function getRomanPaymentsByOrder({
  orderId,
  amount,
}: {
  orderId: number;
  amount: string;
}): Promise<number> {
  const target = parseFloat(amount);
  const EPSILON = 0.03;

  return await prisma.payment.count({
    where: {
      order_id: orderId,
      amount: {
        gte: target - EPSILON,
        lte: target + EPSILON,
      },
    },
  });
}
