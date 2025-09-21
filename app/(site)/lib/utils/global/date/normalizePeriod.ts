import z from "zod";
import { PeriodRequestSchema } from "../../../shared";

/**
 * Normalizes a period input into a standardized object containing `from` and `to` Date properties.
 *
 * @param period - The period to normalize. Can be undefined, a Date, or an object with `from` and optional `to` properties.
 * @returns An object with `from` and `to` Date properties if the input is valid, or `undefined` if no period is provided.
 */
export default function normalizePeriod(
  period?: z.infer<typeof PeriodRequestSchema.shape.period>
): { from: Date; to: Date } | undefined {
  if (!period) return undefined;
  if (period instanceof Date) return { from: period, to: period };
  return { from: period.from, to: period.to ?? period.from };
}
