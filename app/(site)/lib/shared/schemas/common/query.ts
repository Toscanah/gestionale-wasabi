import { z } from "zod";

export const CommonQueryFilterSchema = z.object({
  query: z.string(),
});

export type CommonQueryFilter = z.infer<typeof CommonQueryFilterSchema>;
