import { BaseOrder } from "../../shared";
import { getOrderTotal } from "../order-management/getOrderTotal";

export function prepareRFMInputs(dateFilteredOrders: BaseOrder[], lifetimeOrders: BaseOrder[]) {
  const dateFilteredOrdersCount = dateFilteredOrders.length;

  const lastOrderDateLifetime =
    lifetimeOrders.length > 0
      ? lifetimeOrders.reduce(
          (latest, order) => (order.created_at > latest ? order.created_at : latest),
          new Date(0)
        )
      : undefined;

  const totalSpending = dateFilteredOrders.reduce(
    (sum, order) => sum + getOrderTotal({ order }),
    0
  );

  const averageSpendingFiltered =
    dateFilteredOrdersCount > 0 ? totalSpending / dateFilteredOrdersCount : 0;

  return { dateFilteredOrdersCount, lastOrderDateLifetime, averageSpendingFiltered };
}
