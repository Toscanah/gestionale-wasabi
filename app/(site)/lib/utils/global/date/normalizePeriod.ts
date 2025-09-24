import z from "zod";
import { PeriodRequestSchema } from "../../../shared";
import { endOfDay, startOfDay } from "date-fns";

export default function normalizePeriod(
  period?: z.infer<typeof PeriodRequestSchema.shape.period>
): { from: Date; to: Date } | undefined {
  if (!period) return undefined;
  if (period instanceof Date) return { from: startOfDay(period), to: endOfDay(period) };
  return { from: startOfDay(period.from), to: endOfDay(period.to ?? new Date()) };
}
