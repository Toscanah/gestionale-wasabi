import { CustomerWithDetails } from "../../shared";

export default function extractCustomerOrders(customer: CustomerWithDetails, from?: string, to?: string) {
  const lifetimeOrders = [
    ...customer.home_orders.map((h) => h.order),
    ...customer.pickup_orders.map((p) => p.order),
  ];

  let dateFilteredOrders = lifetimeOrders;
  if (from && to) {
    const parsedStartDate = new Date(from);
    const parsedEndDate = new Date(to);

    parsedStartDate.setHours(0, 0, 0, 0);
    parsedEndDate.setHours(23, 59, 59, 999);

    dateFilteredOrders = dateFilteredOrders.filter(
      (order) => order.created_at >= parsedStartDate && order.created_at <= parsedEndDate
    );
  }

  return { lifetimeOrders, dateFilteredOrders };
}
