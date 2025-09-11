import { OrderType } from "@prisma/client";
import z from "zod";

export namespace OrdersStats {
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

  export const Daily = z.object({
    perDay: Metrics,
  });
  export type Daily = z.infer<typeof Daily>;

  export const Average = z.object({
    revenuePerOrder: z.number(),
  });
  export type Average = z.infer<typeof Average>;

  export const Result = Metrics.merge(Daily).merge(Average);
  export type Result = z.infer<typeof Result>;

  const lowerOrderTypes = Object.values(OrderType).map(
    (t) => t.toLowerCase() as Lowercase<typeof t>
  );
  export const LowerOrderTypeEnum = z.enum(lowerOrderTypes);

  export const Results = z.record(LowerOrderTypeEnum, Result);
  export type Results = z.infer<typeof Results>;
}
