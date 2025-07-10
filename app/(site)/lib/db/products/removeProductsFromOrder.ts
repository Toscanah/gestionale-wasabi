import prisma from "../db";
import { cancelProductInOrder } from "./product-in-order/cancelProductInOrder";

export default async function removeProductsFromOrder({
  productIds,
  orderId,
  cooked = false,
}: {
  productIds: number[];
  orderId: number;
  cooked?: boolean;
}) {
  const productsToDelete = await prisma.productInOrder.findMany({
    where: { id: { in: productIds } },
    include: { options: true },
  });

  for (const pio of productsToDelete) {
    await cancelProductInOrder({
      tx: prisma,
      pio,
      cooked,
    });
  }

  await prisma.optionInProductOrder.deleteMany({
    where: {
      product_in_order_id: {
        in: productIds,
      },
    },
  });

  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      is_receipt_printed: false,
    },
  });
}
