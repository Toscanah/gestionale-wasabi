import { OrderContracts } from "../../shared";
import prisma from "../prisma";

export default async function updateOrderPrintedFlag({
  orderId,
}: OrderContracts.UpdatePrintedFlag.Input): Promise<OrderContracts.UpdatePrintedFlag.Output> {
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

  return { isReceiptPrinted: true };
}
