import { ProductContracts } from "../../shared";
import prisma from "../db";
import { productInOrderInclude } from "../includes";

export default async function updateProductVariationInOrder({
  variation,
  productInOrderId,
}: ProductContracts.UpdateVariationInOrder.Input): Promise<ProductContracts.UpdateVariationInOrder.Output> {
  const productInOrder = await prisma.productInOrder.findUnique({
    where: {
      id: productInOrderId,
    },
  });

  if (!productInOrder) {
    throw new Error("Product in order not found");
  }

  return await prisma.productInOrder.update({
    where: {
      id: productInOrderId,
    },
    data: {
      variation,
    },
    include: {
      ...productInOrderInclude,
    },
  });
}
