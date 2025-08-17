import prisma from "../db";
import { AnyOrder, OrderSchemaInputs } from "@/app/(site)/lib/shared";
import cancelOrder from "./cancelOrder";

export type CancelOrdersInBulkResponse = Pick<AnyOrder, "id" | "type">;

export default async function cancelOrdersInBulk({
  orderIds,
  productsCooked = false,
}: OrderSchemaInputs["CancelOrdersInBulkInput"]): Promise<CancelOrdersInBulkResponse[]> {
  const cancelledOrders = await prisma.$transaction(async () => {
    const results: CancelOrdersInBulkResponse[] = [];

    await Promise.all(
      orderIds.map(async (orderId) => {
        const { id, type } = await cancelOrder({ orderId, cooked: productsCooked });
        results.push({ id, type });
      })
    );

    return results;
  });

  return cancelledOrders;
}
