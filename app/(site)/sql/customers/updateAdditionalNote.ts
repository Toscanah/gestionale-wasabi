import prisma from "../db";

export default async function updateAdditionalNote(note: string, productInOrderId: number) {
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
  });
}
