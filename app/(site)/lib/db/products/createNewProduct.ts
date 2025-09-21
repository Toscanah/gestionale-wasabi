import { ProductContracts } from "../../shared";
import prisma from "../db";
import { categoryInclude } from "../includes";
import { KitchenType } from "@prisma/client";

export default async function createNewProduct({
  product,
}: ProductContracts.Create.Input): Promise<ProductContracts.Create.Output> {
  const existingProduct = await prisma.product.findFirst({
    where: {
      code: product.code,
    },
  });

  if (existingProduct) {
    throw new Error("Product with this code already exists");
  }

  const newProduct = await prisma.product.create({
    data: {
      active: true,
      kitchen: product.kitchen ?? KitchenType.NONE,
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
      ...categoryInclude,
    },
  });

  return newProduct;
}
