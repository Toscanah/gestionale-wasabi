import { z } from "zod";

export const PaginationSchema = z.object({
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
  }),
});

export type PaginationRequest = z.infer<typeof PaginationSchema>;

export const PaginationResponseSchema = z.object({
  totalCount: z.number(),
});
