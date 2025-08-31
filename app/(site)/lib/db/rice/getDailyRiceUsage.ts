import prisma from "../db";
import { RiceContract } from "../../shared";
import { ShiftEvaluableOrder } from "@/app/(site)/lib/shared/types/shift-evaluable-order";
import orderMatchesShift from "../../services/order-management/shift/orderMatchesShift";
import { ProductInOrderStatus } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

export default async function getDailyRiceUsage({
  shift,
}: RiceContract["Requests"]["GetDailyRiceUsage"]): Promise<number> {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const productOrders = await prisma.productInOrder.findMany({
    where: {
      status: {
        in: [ProductInOrderStatus.IN_ORDER, ProductInOrderStatus.DELETED_COOKED],
      },
      order: {
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    },
    include: {
      order: {
        include: {
          home_order: true,
          pickup_order: true,
        },
      },
      product: {
        select: {
          rice: true,
          desc: true,
        },
      },
    },
  });

  let total = 0;

  for (const pio of productOrders) {
    const order = pio.order as ShiftEvaluableOrder;
    if (!orderMatchesShift(order, shift)) continue;
    total += (pio.product?.rice ?? 0) * pio.quantity;
  }

  return total;
}
