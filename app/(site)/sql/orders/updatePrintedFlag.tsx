import prisma from "../db";

export default async function updatePrintedFlag(orderId: number) {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      isReceiptPrinted: true,
    },
  });
}
