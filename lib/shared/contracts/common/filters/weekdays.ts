import z from "zod";

export const WeekdaysFilterSchema = z.object({
  weekdays: z.array(z.number().min(0).max(6)).refine((arr) => !arr.includes(1), {
    message: "Mondays (1) are not allowed",
  }),
});

export type WeekdaysFilter = z.infer<typeof WeekdaysFilterSchema>;
