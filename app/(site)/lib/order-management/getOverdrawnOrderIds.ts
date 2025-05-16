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
    riceLeft -= order.products.reduce((sum, pin) => sum + pin.product.rice * pin.quantity, 0);
    if (riceLeft < 0) {
      redIds.add(order.id); // make sure `id` is actually a number
    }
  }

  return redIds;
}
