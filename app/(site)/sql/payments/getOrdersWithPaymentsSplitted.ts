import { OrderWithPayments } from "@shared"
;
import prisma from "../db";
import { homeOrderInclude, pickupOrderInclude, productsInOrderInclude } from "../includes";

export async function getOrdersWithPaymentsSplitted(): Promise<OrderWithPayments[]> {
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
      engagement: true,
    },
  });

  // This array will hold the new orders with split payments
  const ordersWithSplitPayments: OrderWithPayments[] = [];

  // Iterate through all orders
  orders.forEach((order) => {
    if (order.payments.length > 1) {
      // Split order into sub-orders based on the number of payments
      order.payments.forEach((payment) => {
        const paymentTotals = {
          totalCash: 0,
          totalCard: 0,
          totalVouch: 0,
          totalCredit: 0,
        };

        // Calculate the totals based on this payment
        switch (payment.type) {
          case "CARD":
            paymentTotals.totalCard = payment.amount;
            break;
          case "CASH":
            paymentTotals.totalCash = payment.amount;
            break;
          case "CREDIT":
            paymentTotals.totalCredit = payment.amount;
            break;
          case "VOUCH":
            paymentTotals.totalVouch = payment.amount;
            break;
          default:
            break;
        }

        // Add the parent order information to the sub-order
        ordersWithSplitPayments.push({
          ...order,
          ...paymentTotals,
          payments: [payment], // Only the current payment for this sub-order
        });
      });
    } else {
      // If there's only 1 payment, use the original order
      const paymentTotals = {
        totalCash: 0,
        totalCard: 0,
        totalVouch: 0,
        totalCredit: 0,
      };

      order.payments.forEach((payment) => {
        switch (payment.type) {
          case "CARD":
            paymentTotals.totalCard = payment.amount;
            break;
          case "CASH":
            paymentTotals.totalCash = payment.amount;
            break;
          case "CREDIT":
            paymentTotals.totalCredit = payment.amount;
            break;
          case "VOUCH":
            paymentTotals.totalVouch = payment.amount;
            break;
          default:
            break;
        }
      });

      // Add the order with payment totals to the list
      ordersWithSplitPayments.push({
        ...order,
        ...paymentTotals,
      });
    }
  });

  return ordersWithSplitPayments;
}
