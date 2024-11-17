import { ProductWithInfo } from "../../types/ProductWithInfo";
import prisma from "../db";

export default async function updateProduct(newProduct: ProductWithInfo) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      code: newProduct.code,
      id: {
        not: newProduct.id,
      },
    },
  });

  if (existingProduct) return null;

  return await prisma.product.update({
    where: {
      id: newProduct.id,
    },
    data: {
      code: newProduct.code,
      desc: newProduct.desc,
      site_price: Number(newProduct.site_price),
      home_price: Number(newProduct.home_price),
      rice: newProduct.rice,
      kitchen: newProduct.kitchen,
      category_id: Number(newProduct.category_id) !== -1 ? Number(newProduct.category_id) : null,
    },
    include: {
      category: {
        include: {
          options: {
            include: {
              option: true,
            },
          },
        },
      },
    },
  });
}
