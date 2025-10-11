import z from "zod";

export const OnlyActiveFilterSchema = z.object({
  onlyActive: z.boolean().optional().default(true),
});

export type OnlyActiveFilter = z.infer<typeof OnlyActiveFilterSchema>;