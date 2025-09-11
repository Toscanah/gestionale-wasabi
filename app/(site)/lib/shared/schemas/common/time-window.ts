import { z } from "zod";

export const TimeWindowRequestSchema = z.object({
  from: z.string(), // "HH:mm"
  to: z.string(),
});

export type TimeWindowRequest = z.infer<typeof TimeWindowRequestSchema>;
