import prisma from "../prisma";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import { OrderType, WorkingShift } from "@/prisma/generated/client/enums";
import { OrderContracts, OrdersStats, ShiftFilterValue } from "../../shared";
import { getOrdersStats } from "@/prisma/generated/client/sql";

const EMPTY_RESULT: OrdersStats.Result = {
  orders: 0,
  revenue: 0,
  products: 0,
  soups: 0,
  rices: 0,
  salads: 0,
  rice: 0,
  perDay: {
    orders: 0,
    revenue: 0,
    products: 0,
    soups: 0,
    rices: 0,
    salads: 0,
    rice: 0,
  },
  revenuePerOrder: 0,
};

function cloneEmpty(): OrdersStats.Result {
  return structuredClone(EMPTY_RESULT);
}

export default async function computeOrdersStats(
  input: OrderContracts.ComputeStats.Input
): Promise<OrderContracts.ComputeStats.Output> {
  const { filters } = input ?? {};
  const { period, shift, weekdays, timeWindow, orderTypes } = filters ?? {};

  const normalizedPeriod = normalizePeriod(period);
  const weekdaysStr = weekdays?.length ? weekdays.join(",") : null;
  const orderTypesStr = orderTypes?.length ? orderTypes.join(",") : null;

  console.log(normalizedPeriod)

  const rawStats = await prisma.$queryRawTyped(
    getOrdersStats(
      normalizedPeriod?.from ? new Date(normalizedPeriod.from) : null,
      normalizedPeriod?.to ? new Date(normalizedPeriod.to) : null,
      weekdaysStr,
      shift === ShiftFilterValue.ALL ? null : (shift as WorkingShift),
      timeWindow?.from ?? null,
      timeWindow?.to ?? null,
      orderTypesStr
    )
  );

  console.log(rawStats);

  // 🟢 Read num_days from SQL (same for all rows)
  const numDays = rawStats[0]?.num_days ?? 1;

  const results: OrdersStats.Results = Object.values(OrderType).reduce((acc, type) => {
    const key = type.toLowerCase() as OrdersStats.LowerOrderTypeEnum;
    const isIncluded = !orderTypes || orderTypes.includes(type);
    acc[key] = isIncluded ? cloneEmpty() : null;
    return acc;
  }, {} as OrdersStats.Results);

  for (const row of rawStats) {
    const key = row.type.toLowerCase() as OrdersStats.LowerOrderTypeEnum;
    results[key] = {
      orders: row.orders ?? 0,
      revenue: row.revenue ?? 0,
      products: row.products ?? 0,
      soups: row.soups ?? 0,
      rices: row.rices ?? 0,
      salads: row.salads ?? 0,
      rice: row.rice ?? 0,
      perDay: {
        orders: row.ordersPerDay ?? 0,
        revenue: row.revenuePerDay ?? 0,
        products: row.productsPerDay ?? 0,
        soups: row.soupsPerDay ?? 0,
        rices: row.ricesPerDay ?? 0,
        salads: row.saladsPerDay ?? 0,
        rice: row.ricePerDay ?? 0,
      },
      revenuePerOrder: row.revenuePerOrder ?? 0,
    };
  }

  // If only one type is selected → no "tutti"
  const shouldComputeTutti = !orderTypes || orderTypes.length > 1;

  if (!shouldComputeTutti) {
    return {
      ...results,
      tutti: null,
    };
  }

  // 🟢 SUM TOTALS ONLY (not perDay!)
  const total = Object.values(results)
    .filter((r): r is OrdersStats.Result => r !== null)
    .reduce((acc, r) => {
      acc.orders += r.orders;
      acc.revenue += r.revenue;
      acc.products += r.products;
      acc.soups += r.soups;
      acc.rices += r.rices;
      acc.salads += r.salads;
      acc.rice += r.rice;
      return acc;
    }, cloneEmpty());

  // 🟢 Compute per-day correctly using numDays
  total.perDay = {
    orders: total.orders / numDays,
    revenue: total.revenue / numDays,
    products: total.products / numDays,
    soups: total.soups / numDays,
    rices: total.rices / numDays,
    salads: total.salads / numDays,
    rice: total.rice / numDays,
  };

  // 🟢 revenuePerOrder
  total.revenuePerOrder = total.orders > 0 ? total.revenue / total.orders : 0;

  console.log({ ...results, tutti: total });

  return {
    ...results,
    tutti: total,
  };
}
