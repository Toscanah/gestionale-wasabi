import z from "zod";

export const GetCustomersStatsSchema = z.object({
  customerId: z.number(),
  totalOrders: z.number().nullable(),
  totalSpent: z.number().nullable(),
  averageOrder: z.number().nullable(),
  firstOrderAt: z.date().nullable(),
  lastOrderAt: z.date().nullable(),
  recency: z.number().nullable(),
  frequency: z.number().nullable(),
  monetary: z.number().nullable(),
});

export type GetCustomersStats = z.infer<typeof GetCustomersStatsSchema>;
