import prisma from "../db";

export default async function toggleProduct({ id }: { id: number }) {
  const productId = id;
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
