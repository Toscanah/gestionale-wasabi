import prisma from "../db";

export default async function deleteProductFromOrder(productIds: number[], orderId: number) {
  const productsToDelete = await prisma.productInOrder.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      total: true,
    },
  });

  const totalToDecrement = productsToDelete.reduce((acc, product) => acc + product.total, 0);

  await prisma.optionInProductOrder.deleteMany({
    where: {
      product_in_order_id: {
        in: productIds,
      },
    },
  });

  await prisma.productInOrder.deleteMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      total: {
        decrement: totalToDecrement,
      },
    },
  });
}
