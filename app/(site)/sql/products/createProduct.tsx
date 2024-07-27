import { Product } from "@prisma/client";
import prisma from "../db";
import { ProductWithInfo } from "../../types/ProductWithInfo";

export default async function createProduct(product: ProductWithInfo) {
  return (await prisma.product.findFirst({
    where: {
      code: product.code,
    },
  }))
    ? null
    : await prisma.product.create({
        data: {
          code: product.code,
          name: product.name,
          desc: product.desc,
          site_price: product.site_price,
          home_price: product.home_price,
          rice: product.rice,
          category: {
            connect: {
              id: product.category_id,
            },
          },
        },
      });
}
