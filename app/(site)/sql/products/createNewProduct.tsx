import prisma from "../db";
import { ProductWithInfo } from "../../types/ProductWithInfo";

export default async function createNewProduct(product: ProductWithInfo) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      code: product.code,
    },
  });

  if (existingProduct) return null;

  return  await prisma.product.create({
    data: {
      code: product.code,
      desc: product.desc,
      site_price: product.site_price,
      home_price: product.home_price,
      rice: product.rice,
      category: {
        connect: {
          id: Number(product.category),
        },
      },
    },
    include: {
      category: true,
    },
  });
}
