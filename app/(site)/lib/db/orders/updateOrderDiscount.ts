import { OrderContracts } from "@/app/(site)/lib/shared";
import prisma from "../db";
import { getOrderById } from "./getOrderById";

export default async function updateOrderDiscount({
  orderId,
  discount,
}: OrderContracts.UpdateDiscount.Input): Promise<OrderContracts.UpdateDiscount.Output> {
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
