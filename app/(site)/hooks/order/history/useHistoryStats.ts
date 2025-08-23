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
  mostCommonDaysOfWeek: { day: string; count: number }[]; // 👈 array with counts
  typicalTime: {
    lunch: string | undefined;
    dinner: string | undefined;
    other: string | undefined;
  };
};

export type UseHistoryStatsParams = {
  allOrders: PossibleOrder[];
  year?: string; // "2025", "2024", etc.
  month?: string; // "00" (all months), "01".."12"
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

function calculateMostCommonDays(dayStats: Record<number, number>) {
  const days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

  return Object.entries(dayStats)
    .map(([day, count]) => ({
      day: days[Number(day)],
      count,
    }))
    .sort((a, b) => b.count - a.count); // highest first
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
  mostCommonDaysOfWeek: [],
  typicalTime: {
    lunch: undefined,
    dinner: undefined,
    other: undefined,
  },
};

export default function useHistoryStats({ allOrders, year, month }: UseHistoryStatsParams) {
  const [stats, setStats] = useState<CustomerOrdersStats>(DEFAULT_STATS);

  useEffect(() => {
    if (!allOrders.length) return;

    // 1. Filter orders by year/month before computing stats
    const filtered = allOrders.filter((wrapper) => {
      if (!year) return true; // no filter
      const orderYear = new Date(wrapper.order.created_at).getFullYear().toString();
      if (orderYear !== year) return false;

      if (month === "00") return true; // all months
      const orderMonth = String(new Date(wrapper.order.created_at).getMonth() + 1).padStart(2, "0");
      return orderMonth === month;
    });

    if (!filtered.length) {
      setStats(DEFAULT_STATS);
      return;
    }

    // 2. Compute stats
    let totalSpent = 0;
    const ordersCount: Date[] = [];
    const productStats: Record<string, ProductStats> = {};
    const dayStats: Record<number, number> = {};
    const times: number[] = [];

    for (const wrapper of filtered) {
      const { order } = wrapper;

      totalSpent += getOrderTotal({ order, applyDiscount: true });

      const date = new Date(order.created_at);
      ordersCount.push(date);
      const day = date.getDay();
      dayStats[day] = (dayStats[day] ?? 0) + 1;

      const decimalTime = parseOrderTime(toShiftEvaluableOrder(wrapper));
      times.push(decimalTime);

      for (const product of order.products) {
        const id = product.product.id;
        if (!productStats[id]) {
          productStats[id] = { desc: product.product.desc, quantity: 0 };
        }
        productStats[id].quantity += product.quantity;
      }
    }

    const { mostBoughtProduct, leastBoughtProduct } = calculateProductsStats(productStats);
    const mostCommonDaysOfWeek = calculateMostCommonDays(dayStats);
    const typicalTime = calculateTypicalTime(times);

    setStats({
      mostBoughtProduct,
      leastBoughtProduct,
      totalSpent,
      avgCost: totalSpent / filtered.length,
      ordersCount,
      mostCommonDaysOfWeek,
      typicalTime,
    });
  }, [allOrders, year, month]);

  return { stats };
}
