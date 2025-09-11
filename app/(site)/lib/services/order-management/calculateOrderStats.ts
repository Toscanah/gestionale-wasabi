import {
  MetricsResult,
  OrderStatsMetrics,
  OrderStatsResults,
} from "@/app/(site)/hooks/statistics/useOrdersStats";
import { AnyOrder, ProductInOrder } from "../../shared";
import { OrderType, ProductInOrderStatus } from "@prisma/client";
import getPioRice from "../product-management/getPioRice";
import { DateRange } from "react-day-picker";
import { addDays, differenceInCalendarDays, endOfDay, startOfDay } from "date-fns";
import { Weekday } from "@/app/(site)/components/ui/filters/select/WeekdaysFilter";

export default function calculateResults(
  orders: AnyOrder[],
  period?: DateRange,
  weekdays?: Weekday[]
): OrderStatsResults {
  const acc = {
    home: { orders: 0, revenue: 0, products: 0, soups: 0, rices: 0, salads: 0, rice: 0 },
    pickup: { orders: 0, revenue: 0, products: 0, soups: 0, rices: 0, salads: 0, rice: 0 },
    table: { orders: 0, revenue: 0, products: 0, soups: 0, rices: 0, salads: 0, rice: 0 },
  };

  // Helpers
  const computeLineRevenue = (pio: ProductInOrder) => {
    const paidQty = pio.paid_quantity ?? 0;
    const price = pio.frozen_price ?? 0;
    return paidQty > 0 ? paidQty * price : 0;
  };

  const computeOrderRice = (order: AnyOrder) => {
    if (!Array.isArray(order.products)) return 0;

    let rice = 0;

    for (const pio of order.products) {
      const isCooked =
        pio.status === ProductInOrderStatus.IN_ORDER ||
        pio.status === ProductInOrderStatus.DELETED_COOKED;
      const paidQty = pio.paid_quantity ?? 0;

      if (isCooked && paidQty > 0) {
        rice += getPioRice(pio);
      }
    }

    return rice;
  };

  const computeCategoryCountsFromPIOs = (order: AnyOrder) => {
    if (!Array.isArray(order.products) || order.products.length === 0) {
      return { soups: 0, rices: 0, salads: 0 };
    }

    let soups = 0,
      rices = 0,
      salads = 0;

    for (const pio of order.products) {
      const qty = pio.quantity ?? 0;
      const prod = pio.product;
      soups += (prod.soups ?? 0) * qty;
      rices += (prod.rices ?? 0) * qty;
      salads += (prod.salads ?? 0) * qty;
    }

    return { soups, rices, salads };
  };

  for (const order of orders) {
    let orderRevenue = 0;
    let productCount = 0;

    if (Array.isArray(order.products)) {
      for (const pio of order.products) {
        orderRevenue += computeLineRevenue(pio);
        const qty = pio.paid_quantity ?? 0;
        if (qty > 0) productCount += qty;
      }
    }

    const derived = computeCategoryCountsFromPIOs(order);

    const orderSoups = order.soups && order.soups !== 0 ? order.soups : derived.soups;
    const orderRices = order.rices && order.rices !== 0 ? order.rices : derived.rices;
    const orderSalads = order.salads && order.salads !== 0 ? order.salads : derived.salads;

    const orderRice = computeOrderRice(order);

    const kind = order.type.toLowerCase() as Lowercase<OrderType>;
    const bucket = acc[kind];

    bucket.orders += 1;
    bucket.revenue += orderRevenue;
    bucket.soups += orderSoups;
    bucket.rices += orderRices;
    bucket.salads += orderSalads;
    bucket.rice += orderRice;
    bucket.products += productCount;
  }

  const from = period?.from ? new Date(period.from) : startOfDay(new Date(2025, 0, 1));
  const to = period?.to ? new Date(period.to) : endOfDay(new Date());

  let numDays = 0;
  for (let day = startOfDay(from); day <= to; day = addDays(day, 1)) {
    const dow = day.getDay();
    if (dow === 1) continue; // skip Mondays
    if (weekdays && weekdays.length > 0 && !weekdays.includes(dow as Weekday)) {
      continue;
    }
    numDays++;
  }

  if (numDays === 0) numDays = 1;

  const makeResult = (m: OrderStatsMetrics): MetricsResult => ({
    ...m,
    perDay: {
      orders: m.orders / numDays,
      revenue: m.revenue / numDays,
      products: m.products / numDays,
      soups: m.soups / numDays,
      rices: m.rices / numDays,
      salads: m.salads / numDays,
      rice: m.rice / numDays,
    },
    revenuePerOrder: m.orders > 0 ? m.revenue / m.orders : 0,
  });

  return {
    home: makeResult(acc.home),
    pickup: makeResult(acc.pickup),
    table: makeResult(acc.table),
  };
}
