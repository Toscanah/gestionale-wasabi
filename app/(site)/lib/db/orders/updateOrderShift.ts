import { WorkingShift } from "@prisma/client";
import prisma from "../db";

export async function updateOrderShift({
  orderId,
  shift,
}: {
  orderId: number;
  shift: WorkingShift;
}) {
  await prisma.order.update({
    where: { id: orderId },
    data: { shift },
    select: { id: true },
  });
}
