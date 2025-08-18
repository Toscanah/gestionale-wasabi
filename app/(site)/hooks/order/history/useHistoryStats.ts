import { getOrderTotal } from "@/app/(site)/lib/services/order-management/getOrderTotal";
import { parseOrderTime } from "@/app/(site)/lib/services/order-management/shift/getEffectiveOrderShift";
import {
  HomeOrderWithOrder,
  PickupOrderWithOrder,
  ShiftEvaluableOrder,
} from "@/app/(site)/lib/shared";
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
  avgOrderCost: number;
  ordersCount: Date[];
  mostCommonDayOfWeek: string | undefined;
  mostCommonTime: string | undefined;
};

export type UseHistoryStatsParams = {
  allOrders: (HomeOrderWithOrder | PickupOrderWithOrder)[];
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

function calculateMostCommonTime(timeStats: Record<number, number>) {
  let mostCommonTime: string | undefined;
  let maxTimeCount = 0;

  for (const [hour, count] of Object.entries(timeStats)) {
    if (count > maxTimeCount) {
      maxTimeCount = count;
      mostCommonTime = decimalToTime(Number(hour)).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
  return mostCommonTime;
}

/* ----------------- Hook ----------------- */

const DEFAULT_STATS: CustomerOrdersStats = {
  mostBoughtProduct: undefined,
  leastBoughtProduct: undefined,
  totalSpent: 0,
  avgOrderCost: 0,
  ordersCount: [],
  mostCommonDayOfWeek: undefined,
  mostCommonTime: undefined,
};

export default function useHistoryStats({ allOrders }: UseHistoryStatsParams) {
  const [stats, setStats] = useState<CustomerOrdersStats>(DEFAULT_STATS);

  useEffect(() => {
    if (!allOrders.length) return;

    let totalSpent = 0;
    const ordersCount: Date[] = [];
    const productStats: Record<string, ProductStats> = {};
    const dayStats: Record<number, number> = {};
    const timeStats: Record<number, number> = {};

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
      const hour = Math.floor(decimalTime);
      timeStats[hour] = (timeStats[hour] ?? 0) + 1;

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
    const mostCommonTime = calculateMostCommonTime(timeStats);

    setStats({
      mostBoughtProduct,
      leastBoughtProduct,
      totalSpent,
      avgOrderCost: totalSpent / allOrders.length,
      ordersCount,
      mostCommonDayOfWeek,
      mostCommonTime,
    });
  }, [allOrders]);

  return { stats };
}
