import { z } from "zod";

export const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date().optional(),
});

export const PeriodRequestSchema = z.object({
  period: z.union([z.date(), DateRangeSchema]),
});

export type Period = z.infer<typeof PeriodRequestSchema>;
