import { AnyOrder } from "../../shared";

/**
 * Returns a Set of numeric order IDs that cause or follow a rice shortage.
 */
export default function getOverdrawnOrderIds(orders: AnyOrder[], totalRice: number): Set<number> {
  let riceLeft = totalRice;
  const redIds = new Set<number>();

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const order of sortedOrders) {
    const riceNeeded = order.products.reduce((sum, pin) => sum + (pin.rice_quantity ?? 0), 0);

    if (riceLeft - riceNeeded < 0) {
      redIds.add(order.id);
    }

    riceLeft -= riceNeeded;
  }

  return redIds;
}
