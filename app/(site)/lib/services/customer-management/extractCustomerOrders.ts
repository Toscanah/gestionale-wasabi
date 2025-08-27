import { endOfDay, startOfDay } from "date-fns";
import { CustomerWithDetails } from "../../shared";

export default function extractCustomerOrders(
  customer: CustomerWithDetails,
  from?: Date,
  to?: Date
) {
  const lifetimeOrders = [
    ...customer.home_orders.map((h) => h.order),
    ...customer.pickup_orders.map((p) => p.order),
  ];

  let dateFilteredOrders = lifetimeOrders;
  if (from || to) {
    const startDate = from ? new Date(from) : undefined;
    const endDate = to ? new Date(to) : undefined;

    if (startDate) startOfDay(startDate);
    if (endDate) endOfDay(endDate);

    dateFilteredOrders = dateFilteredOrders.filter((order) => {
      const createdAt = order.created_at;

      if (startDate && endDate) {
        return createdAt >= startDate && createdAt <= endDate;
      }

      if (startDate) {
        return createdAt >= startDate;
      }

      if (endDate) {
        return createdAt <= endDate;
      }

      return true;
    });
  }

  return { lifetimeOrders, dateFilteredOrders };
}
