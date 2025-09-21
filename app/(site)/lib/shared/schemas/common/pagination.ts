import { z } from "zod";

export const PaginationRequestSchema = z.object({
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
  }),
});

export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;

export const PaginationResponseSchema = z.object({
  totalCount: z.number(),
});
