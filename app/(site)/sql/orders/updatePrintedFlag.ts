import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updatePrintedFlag(orderId: number): Promise<boolean> {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      is_receipt_printed: {
        set: true,
      },
    },
  });

  return (await getOrderById(orderId)).is_receipt_printed;
}
