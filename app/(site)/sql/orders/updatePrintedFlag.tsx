import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updatePrintedFlag(orderId: number) {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      is_receipt_printed: true,
    },
  });

  return await getOrderById(orderId);
}
