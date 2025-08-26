import { BaseOrder } from "../../shared";
import { prepareRFMInputs } from "../rfm/prepareRFMInputs";
import calculateRFM from "../rfm/calculateRFM";
import { getOrderTotal } from "../order-management/getOrderTotal";

export function prepareCustomerMetrics(
  dateFilteredOrders: BaseOrder[],
  lifetimeOrders: BaseOrder[]
) {
  const { dateFilteredOrdersCount, lastOrderDateLifetime, averageSpendingFiltered } =
    prepareRFMInputs(dateFilteredOrders, lifetimeOrders);

  const filteredSpending = dateFilteredOrders.reduce(
    (sum, order) => sum + getOrderTotal({ order }),
    0
  );

  const { recency, frequency, monetary } = calculateRFM(
    dateFilteredOrdersCount,
    lastOrderDateLifetime,
    averageSpendingFiltered
  );

  return {
    dateFilteredOrdersCount,
    lastOrderDateLifetime,
    averageSpendingFiltered,
    recency,
    frequency,
    monetary,
    filteredSpending,
  };
}
