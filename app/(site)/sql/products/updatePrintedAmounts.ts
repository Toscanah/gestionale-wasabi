import { ProductInOrder } from "@shared"
;
import prisma from "../db";
import { productInOrderInclude } from "../includes";

export default async function updatePrintedAmounts(orderId: number): Promise<ProductInOrder[]> {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { state: true },
    });

    if (!order || order.state !== "ACTIVE") {
      return [];
    }

    const products = await tx.productInOrder.findMany({
      where: { order_id: orderId, state: "IN_ORDER", quantity: { gt: 0 } },
      include: { ...productInOrderInclude },
    });

    if (products.length === 0) return [];

    const productsToUpdate = products.filter(
      (product) => product.quantity > product.printed_amount
    );

    if (productsToUpdate.length === 0) return [];

    const updatePromises = productsToUpdate.map((product) =>
      tx.productInOrder.update({
        where: { id: product.id },
        data: { printed_amount: product.quantity },
      })
    );

    await Promise.all(updatePromises);

    // used for printing later
    return productsToUpdate.map((product) => ({
      ...product,
      printed_amount: product.quantity - product.printed_amount,
    }));
  });
}
