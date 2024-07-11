import prisma from "../db";

export default async function getProducts() {
  return await prisma.product.findMany({
    include: {
      category: true,
      options: true,
    },
  });
}
