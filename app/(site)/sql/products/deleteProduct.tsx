import prisma from "../db";

export default async function deleteProduct(productIds: number[], orderId: number) {
  const productsToDelete = await prisma.productOnOrder.findMany({
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

  await prisma.productOnOrder.deleteMany({
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
