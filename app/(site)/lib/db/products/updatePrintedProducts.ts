import { ProductContract, ProductInOrder } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { productInOrderInclude } from "../includes";
import { OrderStatus, ProductInOrderStatus } from "@prisma/client";

export default async function updatePrintedProducts({
  orderId,
}: ProductContract["Requests"]["UpdatePrintedProducts"]): Promise<ProductInOrder[]> {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });

    if (!order || order.status !== OrderStatus.ACTIVE) {
      return [];
    }

    const products = await tx.productInOrder.findMany({
      where: { order_id: orderId, status: ProductInOrderStatus.IN_ORDER, quantity: { gt: 0 } },
      include: { ...productInOrderInclude },
    });

    if (products.length === 0) return [];

    const productsToUpdate = products.filter(
      (product) => product.quantity > product.last_printed_quantity
    );

    if (productsToUpdate.length === 0) return [];

    await Promise.all(
      productsToUpdate.map((product) =>
        tx.productInOrder.update({
          where: { id: product.id },
          data: { last_printed_quantity: product.quantity },
        })
      )
    );

    // used for printing later
    return productsToUpdate.map((product) => ({
      ...product,
      to_be_printed: product.quantity - product.last_printed_quantity,
    }));
  });
}
