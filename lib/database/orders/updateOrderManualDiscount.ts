import { OrderContracts } from "@/lib/shared";
import prisma from "../prisma";
import { getOrderById } from "./getOrderById";

export default async function updateOrderManualDiscount({
  orderId,
  discount,
}: OrderContracts.UpdateManualDiscount.Input): Promise<OrderContracts.UpdateManualDiscount.Output> {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      discount: discount ?? 0,
      is_receipt_printed: false,
    },
  });

  return await getOrderById({ orderId, variant: "onlyInOrder" });
}
