import prisma from "../db";

export default async function getRomanPaymentsByOrder({
  orderId,
  amount,
}: {
  orderId: number;
  amount: string;
}): Promise<number> {
  return await prisma.payment.count({
    where: {
      order_id: orderId,
      amount: Number(amount),
    },
  });
}
