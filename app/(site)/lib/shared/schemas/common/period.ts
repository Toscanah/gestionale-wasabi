import { z } from "zod";

const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date().optional(),
});

export const PeriodRequestSchema = z.union([z.date(), DateRangeSchema]).optional();

export type Period = z.infer<typeof PeriodRequestSchema>;