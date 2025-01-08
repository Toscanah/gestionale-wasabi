import { ProductInOrder } from "@/app/(site)/models";
import prisma from "../db";

export default async function updatePrintedAmounts(orderId: number) {
  const remainingProducts: ProductInOrder[] = [];

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { state: true },
  });

  if (order && order.state !== "ACTIVE") {
    return [];
  }

  const products = await prisma.productInOrder.findMany({
    where: { order_id: orderId },
    include: {
      options: {
        include: {
          option: true,
        },
      },
      product: {
        include: {
          category: {
            include: {
              options: {
                select: {
                  option: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (products.length == 0) return [];

  for (const product of products) {
    const remainingToPrint = product.quantity - product.printed_amount;

    if (remainingToPrint > 0) {
      remainingProducts.push({
        ...product,
        printed_amount: remainingToPrint,
      });

      await prisma.productInOrder.update({
        where: { id: product.id },
        data: {
          printed_amount: {
            increment: remainingToPrint,
          },
        },
      });
    }
  }

  return remainingProducts;
}
