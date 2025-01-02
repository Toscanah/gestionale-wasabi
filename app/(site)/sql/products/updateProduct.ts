import { Product } from "../../models";
import prisma from "../db";

export default async function updateProduct(product: Product) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      code: product.code,
      id: {
        not: product.id,
      },
    },
  });

  if (existingProduct) return null;

  return await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      code: product.code,
      desc: product.desc,
      site_price: Number(product.site_price) ?? 0,
      home_price: Number(product.home_price) ?? 0,
      rice: product.rice,
      kitchen: product.kitchen,
      category:
        product.category_id && product.category_id !== -1
          ? {
              connect: {
                id: Number(product.category_id),
              },
            }
          : {
              disconnect: true, // Explicitly disconnect category if `category_id` is null
            },
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
