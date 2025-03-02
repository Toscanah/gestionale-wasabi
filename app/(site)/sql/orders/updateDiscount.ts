import { AnyOrder } from "../../models";
import prisma from "../db";
import getOrderById from "./getOrderById";

export default async function updateDiscount(orderId: number, discount: number): Promise<AnyOrder> {
  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      discount: discount ?? 0,
      is_receipt_printed: false,
    },
  });

  return await getOrderById(orderId)
}
