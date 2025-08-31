import roundToTwo from "../../utils/global/number/roundToTwo";
import { getOrderTotal } from "../order-management/getOrderTotal";
import { BaseOrder } from "../../shared";
import { prepareRFMInputs } from "../rfm/prepareRFMInputs";

function calculateAverageOrders(orders: BaseOrder[]) {
  if (orders.length === 0) {
    return { averageOrdersWeek: 0, averageOrdersMonth: 0, averageOrdersYear: 0 };
  }

  const now = new Date();
  const firstOrderDate = orders.reduce(
    (earliest, order) => (order.created_at < earliest ? order.created_at : earliest),
    now
  );

  const totalDays = (now.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24);
  const totalWeeks = totalDays / 7;
  const totalMonths = totalDays / 30.44;
  const totalYears = totalDays / 365;

  const totalOrders = orders.length;

  return {
    averageOrdersWeek: totalWeeks >= 1 ? totalOrders / totalWeeks : totalOrders,
    averageOrdersMonth: totalMonths >= 1 ? totalOrders / totalMonths : totalOrders,
    averageOrdersYear: totalYears >= 1 ? totalOrders / totalYears : totalOrders,
  };
}

export default function calculateCustomerStats(
  dateFilteredOrders: BaseOrder[],
  dateFilteredOrdersCount: number,
  lastOrderDateLifetime: Date | undefined,
  averageSpendingFiltered: number
) {
  const filteredSpending = dateFilteredOrders.reduce(
    (sum, order) => sum + getOrderTotal({ order }),
    0
  );

  const { averageOrdersWeek, averageOrdersMonth, averageOrdersYear } =
    calculateAverageOrders(dateFilteredOrders);

  const firstOrderDate =
    dateFilteredOrdersCount > 0
      ? dateFilteredOrders.reduce(
          (earliest, order) => (order.created_at < earliest ? order.created_at : earliest),
          new Date()
        )
      : undefined;

  return {
    totalSpending: parseFloat(roundToTwo(filteredSpending)),
    lastOrder: lastOrderDateLifetime,
    firstOrder: firstOrderDate,
    averageSpending: parseFloat(roundToTwo(averageSpendingFiltered)),
    averageOrdersWeek: parseFloat(roundToTwo(averageOrdersWeek)),
    averageOrdersMonth: parseFloat(roundToTwo(averageOrdersMonth)),
    averageOrdersYear: parseFloat(roundToTwo(averageOrdersYear)),
  };
}
