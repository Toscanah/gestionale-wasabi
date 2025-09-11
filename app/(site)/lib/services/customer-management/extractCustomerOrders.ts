import { endOfDay, startOfDay } from "date-fns";
import { MinimalCustomer } from "../../shared";

/**
 * Extracts and filters all orders associated with a customer, optionally within a specified date range.
 *
 * @param customer - The customer object containing home and pickup orders.
 * @param from - (Optional) The start date to filter orders from (inclusive).
 * @param to - (Optional) The end date to filter orders to (inclusive).
 * @returns An object containing:
 *   - `lifetimeOrders`: All orders associated with the customer.
 *   - `dateFilteredOrders`: Orders filtered by the provided date range.
 */
export default function extractCustomerOrders(
  customer: MinimalCustomer,
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
