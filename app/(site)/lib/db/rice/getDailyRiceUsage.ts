import prisma from "../db";
import { setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";
import { RiceSchemaInputs } from "../../shared";
import { ShiftEvaluableOrder } from "@/app/(site)/lib/shared/types/ShiftEvaluableOrder";
import orderMatchesShift from "../../services/order-management/shift/orderMatchesShift";
import { ProductInOrderStatus } from "@prisma/client";

export default async function getDailyRiceUsage({
  shift,
}: RiceSchemaInputs["GetDailyRiceUsageInput"]): Promise<number> {
  const todayStart = setMilliseconds(setSeconds(setMinutes(setHours(new Date(), 0), 0), 0), 0);
  const todayEnd = setMilliseconds(setSeconds(setMinutes(setHours(new Date(), 23), 59), 59), 999);

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
