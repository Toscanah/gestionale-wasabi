import { OrderType } from "@prisma/client";
import prisma from "../db";
import getOrderById from "./getOrderById";
import { AnyOrder, OrderContract } from "@/app/(site)/lib/shared";
import formatWhenLabel from "../../utils/domains/order/formatWhenLabel";
import { updateOrderShift } from "./updateOrderShift";

export default async function updateOrderTime({
  time,
  orderId,
}: OrderContract["Requests"]["UpdateOrderTime"]): Promise<AnyOrder> {
  const baseOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { type: true },
  });

  if (!baseOrder) {
    throw new Error(`Order with id ${orderId} not found`);
  }

  const when = formatWhenLabel(time);
  const subtypeUpdateWhen = {
    data: {
      when,
    },
    where: {
      id: orderId,
    },
  };

  await prisma.order.update({
    where: { id: orderId },
    data: { is_receipt_printed: false },
  });

  if (baseOrder.type === OrderType.PICKUP) {
    await prisma.pickupOrder.update(subtypeUpdateWhen);
  } else {
    await prisma.homeOrder.update(subtypeUpdateWhen);
  }

  await updateOrderShift({ orderId });

  return await getOrderById({ orderId });
}
