import prisma from "../db";
import { AnyOrder } from "@shared";

export default async function cancelOrdersInBulk(
  ordersId: number[],
  productsCooked: boolean = false
): Promise<Pick<AnyOrder, "id" | "type">[]> {
  return await prisma.$transaction(async (tx) => {
    await Promise.all([
      tx.productInOrder.updateMany({
        where: { order_id: { in: ordersId } },
        data: { state: productsCooked ? "DELETED_COOKED" : "DELETED_UNCOOKED" },
      }),

      tx.order.updateMany({
        where: { id: { in: ordersId } },
        data: { state: "CANCELLED" },
      }),
    ]);

    return tx.order.findMany({
      where: { id: { in: ordersId } },
      select: { id: true, type: true },
    });
  });
}
