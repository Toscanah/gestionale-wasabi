import { z } from "zod";

export const CommonQueryFilterSchema = z.object({
  query: z.string().optional(),
});

export type CommonQueryFilter = z.infer<typeof CommonQueryFilterSchema>;
