import { ProductInOrder } from "@shared";
import prisma from "../db";
import { productInOrderInclude } from "../includes";

export default async function updateAdditionalNote({
  note,
  productInOrderId,
}: {
  note: string;
  productInOrderId: number;
}): Promise<ProductInOrder> {
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
      additional_note: note,
    },
    include: {
      ...productInOrderInclude,
    },
  });
}
