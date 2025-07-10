import prisma from "../db";
import { AnyOrder } from "@/app/(site)/lib/shared";
import cancelOrder from "./cancelOrder";

export type CancelOrdersInBulkResponse = Pick<AnyOrder, "id" | "type">;

export default async function cancelOrdersInBulk({
  ordersId,
  productsCooked = false,
}: {
  ordersId: number[];
  productsCooked?: boolean;
}): Promise<CancelOrdersInBulkResponse[]> {
  const cancelledOrders = await prisma.$transaction(async () => {
    const results: CancelOrdersInBulkResponse[] = [];

    await Promise.all(
      ordersId.map(async (orderId) => {
        const { id, type } = await cancelOrder({ orderId, cooked: productsCooked });
        results.push({ id, type });
      })
    );

    return results;
  });

  return cancelledOrders;
}
