import { OrderWithPayments } from "../../models";
import prisma from "../db";

export default async function getOrdersWithPayments(): Promise<OrderWithPayments[]> {
  const orders = await prisma.order.findMany({
    where: {
      payments: {
        some: {},
      },
    },
    include: {
      payments: true,
      home_order: true,
      pickup_order: true,
      table_order: true,
      products: {
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: { include: { option: true } },
        },
      },
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
