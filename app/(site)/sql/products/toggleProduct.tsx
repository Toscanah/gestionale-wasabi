import prisma from "../db";

export default async function toggleProduct(productId: number) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      active: true,
    },
  });

  if (!product) {
    return null;
  }

  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      active: !product.active,
    },
  });
}
