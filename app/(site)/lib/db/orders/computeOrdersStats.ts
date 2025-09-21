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

// little helper for cloning
function cloneEmpty(): OrdersStats.Result {
  return JSON.parse(JSON.stringify(EMPTY_RESULT));
}

export default async function computeOrdersStats(
  input: OrderContracts.ComputeStats.Input
): Promise<OrderContracts.ComputeStats.Output> {
  const { filters } = input ?? {};
  const { period, shift, weekdays, timeWindow } = filters ?? {};
  const normalizedPeriod = normalizePeriod(period);

  const weekdaysStr = weekdays && weekdays.length > 0 ? weekdays.join(",") : null;

  const rawStats = await prisma.$queryRawTyped(
    getOrdersStats(
      normalizedPeriod?.from ? new Date(normalizedPeriod.from) : null,
      normalizedPeriod?.to ? new Date(normalizedPeriod.to) : null,
      weekdaysStr,
      shift === ShiftFilterValue.ALL ? null : (shift as WorkingShift),
      timeWindow?.from ?? null,
      timeWindow?.to ?? null
    )
  );

  const results: OrdersStats.Results = {} as OrdersStats.Results;

  // Initialize all types with cloneEmpty, then fill with data if present
  for (const type of Object.values(OrderType)) {
    const key = type.toLowerCase() as OrdersStats.LowerOrderTypeEnum;
    const row = rawStats.find((r) => r.type.toLowerCase() === key);

    results[key] = row
      ? {
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
        }
      : cloneEmpty();
  }

  return results;
}
