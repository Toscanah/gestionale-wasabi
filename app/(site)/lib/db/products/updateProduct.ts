import { ProductContracts } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { categoryInclude } from "../includes";

export default async function updateProduct({
  product,
}: ProductContracts.Update.Input): Promise<ProductContracts.Update.Output> {
  const existingProduct = await prisma.product.findFirst({
    where: {
      code: product.code,
      id: {
        not: product.id,
      },
    },
  });

  if (!existingProduct) {
    throw new Error("Product with this code does not exist");
  }

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
      salads: product.salads,
      soups: product.soups,
      rices: product.rices,
      category:
        product.category_id && product.category_id !== -1
          ? {
              connect: {
                id: Number(product.category_id),
              },
            }
          : {
              disconnect: true,
            },
    },
    include: {
      ...categoryInclude,
    },
  });
}
