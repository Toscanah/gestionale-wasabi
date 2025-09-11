import { getOrdersStats } from "@prisma/client/sql";
import prisma from "../db";
import { GetOrdersStatsReturn, OrderContract, ShiftFilterValue } from "../../shared";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import { WorkingShift } from "@prisma/client";

export default async function computeOrdersStats({
  filters,
}: OrderContract["Requests"]["ComputeOrdersStats"]): Promise<
  OrderContract["Responses"]["ComputeOrdersStats"]
> {
  const { period, shift, weekdays, timeWindow } = filters;
  const normalizedPeriod = normalizePeriod(period);

  const ordersStats: GetOrdersStatsReturn[] = await prisma.$queryRawTyped(
    getOrdersStats(
      normalizedPeriod?.from ? new Date(normalizedPeriod.from) : null,
      normalizedPeriod?.to ? new Date(normalizedPeriod.to) : null,
      weekdays ? { weekdays } : null,
      shift === ShiftFilterValue.ALL ? null : (shift as WorkingShift),
      timeWindow?.from ?? null,
      timeWindow?.to ?? null
    )
  );

  return ordersStats;
}
