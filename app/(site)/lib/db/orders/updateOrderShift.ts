import { Prisma, WorkingShift } from "@prisma/client";
import prisma from "../db";
import { getEffectiveOrderShift } from "../../services/order-management/shift/getEffectiveOrderShift";
import { ShiftEvaluableOrder } from "../../shared";

export async function updateOrderShift({
  orderId,
  tx,
}: {
  orderId: number;
  tx?: Prisma.TransactionClient;
}): Promise<WorkingShift> {
  const client = tx ?? prisma;

  const order: ShiftEvaluableOrder = await client.order.findUniqueOrThrow({
    where: { id: orderId },
    select: {
      id: true,
      type: true,
      created_at: true,
      shift: true,
      home_order: { select: { when: true } },
      pickup_order: { select: { when: true } },
    },
  });

  return (
    await client.order.update({
      where: { id: order.id },
      data: { shift: getEffectiveOrderShift(order, true).effectiveShift },
      select: { shift: true },
    })
  ).shift;
}
