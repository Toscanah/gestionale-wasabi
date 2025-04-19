import { OrderWithPayments } from "@shared"
;
import prisma from "../db";
import { homeOrderInclude, pickupOrderInclude, productsInOrderInclude } from "../includes";

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
        case "CARD":
          paymentTotals.totalCard += payment.amount;
          break;
        case "CASH":
          paymentTotals.totalCash += payment.amount;
          break;
        case "CREDIT":
          paymentTotals.totalCredit += payment.amount;
          break;
        case "VOUCH":
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
