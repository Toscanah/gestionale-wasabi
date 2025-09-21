import z from "zod";

export const RanksFilterSchema = z.object({
  ranks: z.array(z.string().min(1, "Rank must not be empty")),
});

export type RanksFilter = z.infer<typeof RanksFilterSchema>;
