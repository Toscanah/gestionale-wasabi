import { AnyOrder } from "@/app/(site)/lib/shared";
import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updateOrderDiscount({
  orderId,
  discount,
}: {
  orderId: number;
  discount: number;
}): Promise<AnyOrder> {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      discount: discount ?? 0,
      is_receipt_printed: false,
    },
  });

  return await getOrderById({orderId});
}
