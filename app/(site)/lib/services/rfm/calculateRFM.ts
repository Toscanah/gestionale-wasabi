export default function calculateRFM(
  dateFilteredOrdersCount: number,
  lastOrderDateLifetime: Date | undefined,
  averageSpendingFiltered: number
): {
  recency: number;
  frequency: number;
  monetary: number;
} {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const recency = lastOrderDateLifetime
    ? Math.floor((Date.now() - lastOrderDateLifetime.getTime()) / MS_PER_DAY)
    : Infinity;

  const frequency = dateFilteredOrdersCount;
  const monetary = averageSpendingFiltered;

  return {
    recency,
    frequency,
    monetary,
  };
}
