import { getOrdersDailyStats } from "@prisma/client/sql";
import prisma from "../prisma";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import { OrderType, WorkingShift } from "@prisma/client";
import { OrderContracts, OrdersStats, ShiftFilterValue } from "../../shared";

export default async function computeOrdersDailyStats(
  input: OrderContracts.ComputeDailyStats.Input
): Promise<OrderContracts.ComputeDailyStats.Output> {
  const { filters } = input ?? {};
  const { period, shift, weekdays, timeWindow, orderTypes } = filters ?? {};
  const normalizedPeriod = normalizePeriod(period);

  const weekdaysStr = weekdays && weekdays.length > 0 ? weekdays.join(",") : null;
  const orderTypesStr = orderTypes?.length ? orderTypes.join(",") : null;

  const raw = await prisma.$queryRawTyped(
    getOrdersDailyStats(
      normalizedPeriod?.from ? new Date(normalizedPeriod.from) : null,
      normalizedPeriod?.to ? new Date(normalizedPeriod.to) : null,
      weekdaysStr,
      shift === ShiftFilterValue.ALL ? null : (shift as WorkingShift),
      timeWindow?.from ?? null,
      timeWindow?.to ?? null,
      orderTypesStr
    )
  );

  const normalized = raw.map((r) => ({
    day: new Date(r.day ?? 0),
    orders: Number(r.orders ?? 0),
    revenue: Number(r.revenue ?? 0),
    products: Number(r.products ?? 0),
    soups: Number(r.soups ?? 0),
    rices: Number(r.rices ?? 0),
    salads: Number(r.salads ?? 0),
    rice: Number(r.rice ?? 0),
    revenuePerOrder: Number(r.revenuePerOrder ?? 0),
    type: r.type as OrderType,
  }));

  const results: OrdersStats.DailyResults = {
    home: [],
    pickup: [],
    table: [],
  };

  for (const row of normalized) {
    const key = row.type.toLocaleLowerCase() as OrdersStats.LowerOrderTypeEnum;
    results[key].push(row);
  }

  for (const key of Object.keys(results) as (keyof typeof results)[]) {
    results[key].sort((a, b) => a.day.getTime() - b.day.getTime());
  }

  return results;
}
