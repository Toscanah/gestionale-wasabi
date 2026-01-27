import prisma from "../prisma";
import { OrderContracts } from "@/lib/shared";
import cancelOrder from "./cancelOrder";

export default async function cancelOrdersInBulk({
  orderIds,
  productsCooked = false,
}: OrderContracts.CancelInBulk.Input): Promise<OrderContracts.CancelInBulk.Output> {
  const cancelledOrders = await prisma.$transaction(async () => {
    const results: OrderContracts.CancelInBulk.Output = [];

    await Promise.all(
      orderIds.map(async (orderId) => {
        const { id, type } = await cancelOrder({ orderId, cooked: productsCooked, hardCancel: false });
        results.push({ orderId: id, type });
      })
    );

    return results;
  });

  return cancelledOrders;
}
