import prisma from "../db";

export default async function deleteProduct(
  productIds: number[],
  orderId: number
) {
  const productsToDelete = await prisma.productOnOrder.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      total: true,
    },
  });

  const totalToDecrement = productsToDelete.reduce(
    (acc, product) => acc + product.total,
    0
  );

  const deletedProducts = await prisma.productOnOrder.deleteMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      total: {
        decrement: totalToDecrement,
      },
    },
  });

  return deletedProducts;
}
