import prisma from "../db";

export default async function deleteProduct(productIds: number[]) {
  return await prisma.productsOnOrder.deleteMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
}
