import { BaseOrder } from "../../shared";
import { getOrderTotal } from "../order-management/getOrderTotal";

export function prepareRFMInputs(lifetimeOrders: BaseOrder[]) {
  const orderCount = lifetimeOrders.length;

  const totalSpending = lifetimeOrders.reduce((sum, order) => sum + getOrderTotal({ order }), 0);

  const averageSpending = orderCount > 0 ? totalSpending / orderCount : 0;

  return {
    orderCount,
    totalSpending,
    averageSpending,
  };
}
