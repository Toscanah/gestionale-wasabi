import { Order } from "@prisma/client";
import { CustomerWithStats } from "../../shared/types/CustomerWithStats";
import roundToTwo from "../../formatting-parsing/roundToTwo";
import getCustomersWithDetails from "./getCustomersWithDetails";
import { getOrderTotal } from "../../services/order-management/getOrderTotal";
import { CustomerSchemaInputs } from "../../shared";
import { calculateRfmScore } from "../../services/rfm/calculateRfmScore";

const calculateAverageOrders = (allOrders: Order[]) => {
  if (allOrders.length === 0) {
    return { averageWeek: 0, averageMonth: 0, averageYear: 0 };
  }

  const now = new Date();
  const firstOrderDate = allOrders.reduce((earliest, order) => {
    const date = order.created_at;
    return date < earliest ? date : earliest;
  }, now);

  const totalDays = (now.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24);
  const totalWeeks = totalDays / 7;
  const totalMonths = totalDays / 30.44;
  const totalYears = totalDays / 365;

  const totalOrders = allOrders.length;

  const averageOrdersWeek = totalWeeks >= 1 ? totalOrders / totalWeeks : totalOrders;
  const averageOrdersMonth = totalMonths >= 1 ? totalOrders / totalMonths : totalOrders;
  const averageOrdersYear = totalYears >= 1 ? totalOrders / totalYears : totalOrders;

  return { averageOrdersWeek, averageOrdersMonth, averageOrdersYear };
};

export default async function getCustomersWithStats({
  from,
  to,
}: CustomerSchemaInputs["GetCustomersWithStatsInput"]): Promise<CustomerWithStats[]> {
  const customers = (await getCustomersWithDetails()).filter((customer) => customer.active);

  const customersWithStats = customers.map((customer) => {
    const lifetimeOrders = [
      ...customer.home_orders.map((homeOrder) => homeOrder.order),
      ...customer.pickup_orders.map((pickupOrder) => pickupOrder.order),
    ];

    // apply filtering only for frequency/monetary
    let allOrders = lifetimeOrders;
    if (from && to) {
      const parsedStartDate = new Date(from);
      const parsedEndDate = new Date(to);

      parsedStartDate.setHours(0, 0, 0, 0);
      parsedEndDate.setHours(23, 59, 59, 999);

      const startDate = new Date(
        parsedStartDate.getTime() - parsedStartDate.getTimezoneOffset() * 60000
      );
      const endDate = new Date(parsedEndDate.getTime() - parsedEndDate.getTimezoneOffset() * 60000);

      allOrders = allOrders.filter((order) => {
        const createdAt = order.created_at;
        return createdAt >= startDate && createdAt <= endDate;
      });
    }

    const totalSpending = allOrders.reduce((sum, order) => sum + getOrderTotal({ order }), 0);

    const lastOrderDateLifetime =
      lifetimeOrders.length > 0
        ? lifetimeOrders.reduce((latest, order) => {
            const date = order.created_at;
            return date > latest ? date : latest;
          }, new Date(0))
        : undefined;

    const firstOrderDate =
      allOrders.length > 0
        ? allOrders.reduce((earliest, order) => {
            const date = order.created_at;
            return date < earliest ? date : earliest;
          }, new Date())
        : undefined;

    const averageSpending = allOrders.length > 0 ? totalSpending / allOrders.length : 0;

    const {
      averageOrdersWeek = 0,
      averageOrdersMonth = 0,
      averageOrdersYear = 0,
    } = calculateAverageOrders(allOrders);

    // // RFM
    const recency = lastOrderDateLifetime
      ? Math.floor((Date.now() - lastOrderDateLifetime.getTime()) / (1000 * 60 * 60 * 24))
      : Infinity;

    const frequency = allOrders.length; // filtered by window if provided
    const monetary = averageSpending; // filtered by window if provided

    const rfm = { recency, frequency, monetary };
    // const score = calculateRfmScore(rfm, rfmRules).finalScore;

    return {
      ...customer,
      totalSpending: parseFloat(roundToTwo(totalSpending)),
      lastOrder: lastOrderDateLifetime,
      firstOrder: firstOrderDate,
      averageSpending: parseFloat(roundToTwo(averageSpending)),
      averageOrdersWeek: parseFloat(roundToTwo(averageOrdersWeek)),
      averageOrdersMonth: parseFloat(roundToTwo(averageOrdersMonth)),
      averageOrdersYear: parseFloat(roundToTwo(averageOrdersYear)),
      rfm: {
        score: {
          recency,
          frequency,
          monetary,
          finalScore: 0,
        },
        rank: "none"
      }
    } as CustomerWithStats;
  });

  return customersWithStats;
}
