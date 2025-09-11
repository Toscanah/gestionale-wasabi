import prisma from "../db";
import { updateOrderShift } from "./updateOrderShift";
import { getEffectiveOrderShift } from "../../services/order-management/shift/getEffectiveOrderShift";
import { ShiftEvaluableOrder } from "../../shared";

export default async function updateOrdersShift() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
    },
  });

  return await Promise.all(orders.map(async (o) => await updateOrderShift({ orderId: o.id })));
}
