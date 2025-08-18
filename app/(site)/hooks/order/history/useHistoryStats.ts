import { PossibleOrder } from "@/app/(site)/components/order-history/OrderHistory";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import { parseOrderTime } from "@/app/(site)/lib/services/order-management/shift/getEffectiveOrderShift";
import {
  HomeOrderWithOrder,
  PickupOrderWithOrder,
  ShiftEvaluableOrder,
} from "@/app/(site)/lib/shared";
import { ShiftTime } from "@/app/(site)/lib/shared/enums/Shift";
import decimalToTime from "@/app/(site)/lib/utils/global/time/decimalToTime";
import { OrderType } from "@prisma/client";
import { useEffect, useState } from "react";

type ProductStats = {
  desc: string;
  quantity: number;
};

export type CustomerOrdersStats = {
  mostBoughtProduct: ProductStats | undefined;
  leastBoughtProduct: ProductStats | undefined;
  totalSpent: number;
  avgCost: number;
  ordersCount: Date[];
  mostCommonDayOfWeek: string | undefined;
  typicalTime: {
    lunch: string | undefined;
    dinner: string | undefined;
    other: string | undefined;
  };
};

export type UseHistoryStatsParams = {
  allOrders: PossibleOrder[];
};

/* ----------------- Helpers ----------------- */

function toShiftEvaluableOrder(
  wrapper: HomeOrderWithOrder | PickupOrderWithOrder
): ShiftEvaluableOrder {
  const { order } = wrapper;

  if (order.type === OrderType.HOME) {
    return {
      ...order,
      type: OrderType.HOME,
      created_at: order.created_at,
      home_order: { when: wrapper.when },
    };
  }

  if (order.type === OrderType.PICKUP) {
    return {
      ...order,
      type: OrderType.PICKUP,
      created_at: order.created_at,
      pickup_order: { when: wrapper.when },
    };
  }

  throw new Error("Unsupported order type");
}

function calculateProductsStats(productStats: Record<string, ProductStats>) {
  let mostBoughtProduct: ProductStats | undefined;
  let leastBoughtProduct: ProductStats | undefined;

  for (const stats of Object.values(productStats)) {
    if (!mostBoughtProduct || stats.quantity > mostBoughtProduct.quantity) {
      mostBoughtProduct = stats;
    }
    if (!leastBoughtProduct || stats.quantity < leastBoughtProduct.quantity) {
      leastBoughtProduct = stats;
    }
  }
  return { mostBoughtProduct, leastBoughtProduct };
}

function calculateMostCommonDay(dayStats: Record<number, number>) {
  const days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  let mostCommonDayOfWeek: string | undefined;
  let maxDayCount = 0;

  for (const [day, count] of Object.entries(dayStats)) {
    if (count > maxDayCount) {
      maxDayCount = count;
      mostCommonDayOfWeek = days[Number(day)];
    }
  }
  return mostCommonDayOfWeek;
}

function getTimeSlot(decimalHour: number): "lunch" | "dinner" | "other" {
  if (decimalHour >= ShiftTime.LUNCH_FROM && decimalHour <= ShiftTime.LUNCH_TO) return "lunch";
  if (decimalHour >= ShiftTime.DINNER_FROM && decimalHour <= ShiftTime.DINNER_TO) return "dinner";
  return "other";
}

function calculateTypicalTimeBySlot(times: number[]) {
  if (!times.length) return undefined;

  // sort and median
  const sorted = [...times].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const avgDeviation = sorted.reduce((acc, t) => acc + Math.abs(t - median), 0) / sorted.length;

  const medianDate = decimalToTime(median);
  const deviationMinutes = Math.round(avgDeviation * 60);

  return `${medianDate.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  })} ± ${deviationMinutes}m`;
}

function calculateTypicalTime(allTimes: number[]) {
  const slotBuckets: Record<"lunch" | "dinner" | "other", number[]> = {
    lunch: [],
    dinner: [],
    other: [],
  };

  for (const t of allTimes) {
    const slot = getTimeSlot(t);
    slotBuckets[slot].push(t);
  }

  return {
    lunch: calculateTypicalTimeBySlot(slotBuckets.lunch),
    dinner: calculateTypicalTimeBySlot(slotBuckets.dinner),
    other: calculateTypicalTimeBySlot(slotBuckets.other),
  };
}

/* ----------------- Hook ----------------- */

const DEFAULT_STATS: CustomerOrdersStats = {
  mostBoughtProduct: undefined,
  leastBoughtProduct: undefined,
  totalSpent: 0,
  avgCost: 0,
  ordersCount: [],
  mostCommonDayOfWeek: undefined,
  typicalTime: {
    lunch: undefined,
    dinner: undefined,
    other: undefined,
  },
};

export default function useHistoryStats({ allOrders }: UseHistoryStatsParams) {
  const [stats, setStats] = useState<CustomerOrdersStats>(DEFAULT_STATS);

  useEffect(() => {
    if (!allOrders.length) return;

    let totalSpent = 0;
    const ordersCount: Date[] = [];
    const productStats: Record<string, ProductStats> = {};
    const dayStats: Record<number, number> = {};
    const times: number[] = [];

    for (const wrapper of allOrders) {
      const { order } = wrapper;

      // spent
      totalSpent += getOrderTotal({ order, applyDiscount: true });

      // date + weekday
      const date = new Date(order.created_at);
      ordersCount.push(date);
      const day = date.getDay();
      dayStats[day] = (dayStats[day] ?? 0) + 1;

      // time bucket
      const decimalTime = parseOrderTime(toShiftEvaluableOrder(wrapper));
      times.push(decimalTime);

      // products
      for (const product of order.products) {
        const id = product.product.id;
        if (!productStats[id]) {
          productStats[id] = { desc: product.product.desc, quantity: 0 };
        }
        productStats[id].quantity += product.quantity;
      }
    }

    const { mostBoughtProduct, leastBoughtProduct } = calculateProductsStats(productStats);
    const mostCommonDayOfWeek = calculateMostCommonDay(dayStats);
    const typicalTime = calculateTypicalTime(times);

    setStats({
      mostBoughtProduct,
      leastBoughtProduct,
      totalSpent,
      avgCost: totalSpent / allOrders.length,
      ordersCount,
      mostCommonDayOfWeek,
      typicalTime,
    });
  }, [allOrders]);

  return { stats };
}
