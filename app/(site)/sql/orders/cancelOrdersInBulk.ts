import prisma from "../db";
import { AnyOrder } from "@shared";
import cancelOrder from "./cancelOrder";

export default async function cancelOrdersInBulk({
  ordersId,
  productsCooked = false,
}: {
  ordersId: number[];
  productsCooked?: boolean;
}): Promise<Pick<AnyOrder, "id" | "type">[]> {
  const cancelledOrders = await prisma.$transaction(async () => {
    const results: Pick<AnyOrder, "id" | "type">[] = [];

    for (const orderId of ordersId) {
      const order = await cancelOrder({ orderId, cooked: productsCooked });
      results.push({ id: order.id, type: order.type });
    }

    return results;
  });

  return cancelledOrders;
}
