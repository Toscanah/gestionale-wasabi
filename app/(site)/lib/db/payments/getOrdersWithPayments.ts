import { OrderWithPayments } from "@/app/(site)/lib/shared";
import prisma from "../db";
import {
  engagementsInclude,
  homeOrderInclude,
  pickupOrderInclude,
  productsInOrderInclude,
} from "../includes";
import { PaymentType } from "@prisma/client";
export default async function getOrdersWithPayments(): Promise<OrderWithPayments[]> {
  const orders = await prisma.order.findMany({
    where: {
      payments: {
        some: {},
      },
    },
    include: {
      payments: true,
      ...homeOrderInclude,
      ...pickupOrderInclude,
      table_order: true,
      ...productsInOrderInclude,
      ...engagementsInclude,
    },
  });

  const ordersWithPaymentTotals = orders.map((order) => {
    const paymentTotals = {
      totalCash: 0,
      totalCard: 0,
      totalVouch: 0,
      totalCredit: 0,
    };

    order.payments.forEach((payment) => {
      switch (payment.type) {
        case PaymentType.CARD:
          paymentTotals.totalCard += payment.amount;
          break;
        case PaymentType.CASH:
          paymentTotals.totalCash += payment.amount;
          break;
        case PaymentType.CREDIT:
          paymentTotals.totalCredit += payment.amount;
          break;
        case PaymentType.VOUCH:
          paymentTotals.totalVouch += payment.amount;
          break;
        default:
          break;
      }
    });

    return {
      ...order,
      ...paymentTotals,
    };
  });

  return ordersWithPaymentTotals;
}
