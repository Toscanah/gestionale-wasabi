import { ProductContracts } from "../../shared";
import prisma from "../prisma";

export default async function toggleProduct({
  id,
}: ProductContracts.Toggle.Input): Promise<ProductContracts.Toggle.Output> {
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
    throw new Error("Product not found");
  }

  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      active: !product.active,
    },
    select: {
      id: true,
      active: true,
    },
  });
}
