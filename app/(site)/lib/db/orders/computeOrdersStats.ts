import { getOrdersStats } from "@prisma/client/sql";
import prisma from "../db";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import { OrderType, WorkingShift } from "@prisma/client";
import { OrderContracts, OrdersStats, ShiftFilterValue } from "../../shared";

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

  // ✅ Compute "tutti" only when it makes sense
  const shouldComputeTutti = !orderTypes || orderTypes.length > 1;

  if (!shouldComputeTutti) {
    return {
      ...results,
      tutti: null,
    };
  }

  const tutti = Object.values(results)
    .filter((r): r is OrdersStats.Result => r !== null)
    .reduce((acc, r) => {
      acc.orders += r.orders;
      acc.revenue += r.revenue;
      acc.products += r.products;
      acc.soups += r.soups;
      acc.rices += r.rices;
      acc.salads += r.salads;
      acc.rice += r.rice;
      acc.perDay.orders += r.perDay.orders;
      acc.perDay.revenue += r.perDay.revenue;
      acc.perDay.products += r.perDay.products;
      acc.perDay.soups += r.perDay.soups;
      acc.perDay.rices += r.perDay.rices;
      acc.perDay.salads += r.perDay.salads;
      acc.perDay.rice += r.perDay.rice;
      return acc;
    }, cloneEmpty());

  tutti.revenuePerOrder = tutti.orders > 0 ? tutti.revenue / tutti.orders : 0;

  return {
    ...results,
    tutti,
  };
}
