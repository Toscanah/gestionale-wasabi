import { Product } from "../../models";
import prisma from "../db";

export default async function createNewProduct(product: Product) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      code: product.code,
    },
  });

  if (existingProduct) return null;

  const newProduct = await prisma.product.create({
    data: {
      active: true,
      kitchen: product.kitchen ?? "NONE",
      code: product.code,
      desc: product.desc,
      rices: product.rices,
      salads: product.salads,
      soups: product.soups,
      site_price: Number(product.site_price) ?? 0,
      home_price: Number(product.home_price) ?? 0,
      rice: product.rice,
      category_id: product.category_id ? Number(product.category_id) || null : null,
    },
    include: {
      category: true,
    },
  });

  return newProduct;
}
