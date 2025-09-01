import prisma from "../db";
import { updateOrderShift } from "./updateOrderShift";
import { getEffectiveOrderShift } from "../../services/order-management/shift/getEffectiveOrderShift";

export default async function updateOrdersShift() {
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { home_order: { isNot: null } },
        { pickup_order: { isNot: null } },
        { table_order: { isNot: null } },
      ],
    },
    select: {
      id: true,
      type: true,
      created_at: true,
      shift: true,
      home_order: {
        select: {
          when: true,
        },
      },
      pickup_order: {
        select: {
          when: true,
        },
      },
    },
  });

  return await Promise.all(
    orders.map(
      async (o) =>
        await updateOrderShift({
          orderId: o.id,
          shift: getEffectiveOrderShift(o, true).effectiveShift,
        })
    )
  );
}
