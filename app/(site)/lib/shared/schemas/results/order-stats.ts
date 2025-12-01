import { OrderType } from "@/prisma/generated/client/enums";
import z from "zod";

export namespace OrdersStats {
  // --- BASE METRICS ---
  export const Metrics = z.object({
    orders: z.number(),
    revenue: z.number(),
    products: z.number(),
    soups: z.number(),
    rices: z.number(),
    salads: z.number(),
    rice: z.number(),
  });
  export type Metrics = z.infer<typeof Metrics>;

  // --- DAILY AVERAGE SUMMARY ---
  export const Daily = z.object({
    perDay: Metrics,
  });
  export type Daily = z.infer<typeof Daily>;

  // --- AVERAGE METRIC (revenue/order) ---
  export const Average = z.object({
    revenuePerOrder: z.number(),
  });
  export type Average = z.infer<typeof Average>;

  // --- AGGREGATED RESULT (used in computeOrdersStats) ---
  export const Result = Metrics.and(Daily).and(Average);
  export type Result = z.infer<typeof Result>;

  // --- ORDER TYPES ENUM ---
  const lowerOrderTypes = Object.values(OrderType).map(
    (t) => t.toLowerCase() as Lowercase<typeof t>
  );
  export const LowerOrderTypeEnum = z.enum(lowerOrderTypes);
  export type LowerOrderTypeEnum = z.infer<typeof LowerOrderTypeEnum>;

  export const ResultsKeyEnum = z.union([LowerOrderTypeEnum, z.literal("tutti")]);
  export type ResultsKeyEnum = z.infer<typeof ResultsKeyEnum>;

  // --- AGGREGATED RESULTS ---
  export const Results = z.record(ResultsKeyEnum, Result.nullable());
  export type Results = z.infer<typeof Results>;

  // -------------------------------
  // NEW: DAILY TIME-SERIES STRUCTURE
  // -------------------------------
  export const DailyRow = z
    .object({
      day: z.date(),
    })
    .and(Metrics)
    .and(Average);
  export type DailyRow = z.infer<typeof DailyRow>;

  export const DailyResults = z.record(LowerOrderTypeEnum, z.array(DailyRow));
  export type DailyResults = z.infer<typeof DailyResults>;

  // -------------------------------
  // UNIFIED TYPE (either summary or daily)
  // -------------------------------
  export type AnyResults = Results | DailyResults;
}
