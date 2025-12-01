import { PossibleOrder } from "@/app/(site)/components/order-history/OrderHistory";
import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import { parseOrderTime } from "@/app/(site)/lib/services/order-management/shift/getEffectiveOrderShift";
import {
  HomeOrderWithOrder,
  OrderGuards,
  PickupOrderWithOrder,
  ShiftEvaluableOrder,
} from "@/app/(site)/lib/shared";
import { ShiftBoundaries } from "@/app/(site)/lib/shared/enums/Shift";
import decimalToTime from "@/app/(site)/lib/utils/global/time/decimalToTime";
import { OrderType } from "@/prisma/generated/client/enums";
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
  mostCommonDaysOfWeek: { day: string; count: number }[];
  typicalTime: {
    lunch: string | undefined;
    dinner: string | undefined;
    other: string | undefined;
  };
};

export type UseHistoryStatsParams = {
  allOrders: PossibleOrder[];
  yearsFilter?: string[]; // e.g. ["2024", "2025"]
  monthsFilter?: string[]; // e.g. ["01","02"] or ["00"] for all months
};

/* ----------------- Helpers ----------------- */

function toShiftEvaluableOrder(
  wrapper: HomeOrderWithOrder | PickupOrderWithOrder
): ShiftEvaluableOrder {
  if ("home_order" in wrapper) {
    const { order, when } = wrapper;
    return {
      ...order,
      type: OrderType.HOME,
      created_at: order.created_at,
      home_order: { when },
      pickup_order: null,
    };
  }

  const { order, when } = wrapper;
  return {
    ...order,
    type: OrderType.PICKUP,
    created_at: order.created_at,
    pickup_order: { when },
    home_order: null,
  };

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
    .sort((a, b) => b.count - a.count);
}

function getTimeSlot(decimalHour: number): "lunch" | "dinner" | "other" {
  if (decimalHour >= ShiftBoundaries.LUNCH_FROM && decimalHour <= ShiftBoundaries.LUNCH_TO)
    return "lunch";
  if (decimalHour >= ShiftBoundaries.DINNER_FROM && decimalHour <= ShiftBoundaries.DINNER_TO)
    return "dinner";
  return "other";
}

function calculateTypicalTimeBySlot(times: number[]) {
  if (!times.length) return undefined;

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

export default function useHistoryStats({
  allOrders,
  yearsFilter,
  monthsFilter,
}: UseHistoryStatsParams) {
  const [stats, setStats] = useState<CustomerOrdersStats>(DEFAULT_STATS);

  useEffect(() => {
    if (!allOrders.length) return;

    // 1. Filter orders by years/months before computing stats
    const filtered = allOrders.filter((wrapper) => {
      const orderDate = new Date(wrapper.order.created_at);
      const orderYear = orderDate.getFullYear().toString();
      const orderMonth = String(orderDate.getMonth() + 1).padStart(2, "0");

      // year filtering
      if (yearsFilter && yearsFilter.length > 0) {
        if (!yearsFilter.includes("all") && !yearsFilter.includes(orderYear)) {
          return false;
        }
      }

      // month filtering
      if (monthsFilter && monthsFilter.length > 0) {
        if (monthsFilter.includes("00")) {
          return true; // "00" means all months
        }
        return monthsFilter.includes(orderMonth);
      }

      return true;
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

      totalSpent += getOrderTotal({ order, applyDiscounts: true });

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
  }, [allOrders, yearsFilter, monthsFilter]);

  return { stats };
}
