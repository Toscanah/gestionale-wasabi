import prisma from "../db";
import { ProductWithInfo } from "../../types/ProductWithInfo";

export default async function createNewProduct(product: ProductWithInfo) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      code: product.code,
    },
  });

  if (existingProduct) return null;

  return await prisma.product.create({
    data: {
      code: product.code,
      desc: product.desc,
      site_price: Number(product.site_price),
      home_price: Number(product.home_price),
      rice: product.rice,
      category_id: product.category_id ? Number(product.category_id) || null : null,
    },
    include: {
      category: true,
    },
  });
}
