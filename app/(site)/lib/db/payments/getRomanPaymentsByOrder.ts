import { PaymentContracts } from "../../shared";
import prisma from "../prisma";
import { PaymentScope } from "@/prisma/generated/client/enums";

export default async function getRomanPaymentsByOrder({
  orderId,
}: PaymentContracts.GetRomanPaymentsByOrder.Input): Promise<PaymentContracts.GetRomanPaymentsByOrder.Output> {
  const romanPayments = await prisma.payment.findMany({
    where: {
      order_id: orderId,
      scope: PaymentScope.ROMAN,
    },
    orderBy: {
      created_at: "asc",
    },
    select: {
      id: true,
      amount: true,
      payment_group_code: true,
    },
  });

  return { romanPayments };
}
