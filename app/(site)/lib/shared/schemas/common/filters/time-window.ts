import { z } from "zod";

export const TimeWindowFilterSchema = z.object({
  timeWindow: z.object({
    from: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format, expected HH:mm" }),
    to: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format, expected HH:mm" }),
  }),
});

export type TimeWindowFilter = z.infer<typeof TimeWindowFilterSchema>;
