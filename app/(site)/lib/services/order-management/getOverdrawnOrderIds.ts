import { LiteOrder } from "../../shared";
import getPioRice from "../../services/product-management/getPioRice";

export default function getOverdrawnOrderIds(orders: LiteOrder[], totalRice: number): Set<number> {
  let riceLeft = totalRice;
  const redIds = new Set<number>();

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const order of sortedOrders) {
    const riceNeeded = order.products.reduce((sum, pin) => sum + getPioRice(pin), 0);

    if (riceLeft - riceNeeded < 0) {
      redIds.add(order.id);
    }

    riceLeft -= riceNeeded;
  }

  return redIds;
}
