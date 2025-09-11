/**
 * Calculates the RFM (Recency, Frequency, Monetary) metrics for a customer.
 *
 * @param last_order_at - The date of the customer's last order. If undefined, recency is set to Infinity.
 * @param total_orders - The total number of orders placed by the customer.
 * @param average_order - The average value of the customer's orders.
 * @returns An object containing:
 *   - `recency`: Number of days since the last order (or Infinity if no orders).
 *   - `frequency`: Total number of orders.
 *   - `monetary`: Average order value.
 */
export default function calculateRFM(
  last_order_at: Date | undefined,
  total_orders: number,
  average_order: number
): {
  recency: number;
  frequency: number;
  monetary: number;
} {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const recency = last_order_at
    ? Math.floor((Date.now() - last_order_at.getTime()) / MS_PER_DAY)
    : Infinity;

  const frequency = total_orders;
  const monetary = average_order;

  return {
    recency,
    frequency,
    monetary,
  };
}
