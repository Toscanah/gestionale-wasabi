import prisma from "../db";
import { PaymentScope } from "@prisma/client";

export default async function getRomanPaymentsByOrder({
  orderId,
}: {
  orderId: number;
}): Promise<{ payments: { amount: number; payment_group_code: string | null }[] }> {
  const romanPayments = await prisma.payment.findMany({
    where: {
      order_id: orderId,
      scope: PaymentScope.ROMAN,
    },
    orderBy: {
      created_at: "asc",
    },
    select: {
      amount: true,
      payment_group_code: true,
    },
  });

  return { payments: romanPayments };
}
