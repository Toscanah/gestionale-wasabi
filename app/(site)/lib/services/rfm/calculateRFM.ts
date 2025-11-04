import { LiteOrder } from "../../shared";
import { getOrderTotal } from "../order-management/getOrderTotal";

/**
 * Calculates the RFM (Recency, Frequency, Monetary) metrics for a customer.
 *
 * - Recency: days since the last order
 * - Frequency: number of orders in the last 30 days
 * - Monetary: lifetime average order value
 */
export default function calculateRFM(orders: LiteOrder[]): {
  recency: number;
  frequency: number;
  monetary: number;
} {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Get the most recent order date
  const lastOrderAt = orders.length
    ? orders.reduce(
        (latest, order) => (order.created_at > latest ? order.created_at : latest),
        orders[0].created_at
      )
    : undefined;

  // Recency = days since last order
  const recency = lastOrderAt
    ? Math.floor((Date.now() - lastOrderAt.getTime()) / MS_PER_DAY)
    : Infinity;

  // Frequency = number of orders in the last 30 days
  const THIRTY_DAYS_AGO = Date.now() - 30 * MS_PER_DAY;
  const frequency = orders.filter((o) => o.created_at.getTime() >= THIRTY_DAYS_AGO).length;

  console.log(orders.length);
  const monetary =
    orders.length > 0
      ? orders.reduce((sum, o) => sum + getOrderTotal({ order: o, applyDiscounts: true }), 0)
      : 0;
  return {
    recency,
    frequency,
    monetary,
  };
}
