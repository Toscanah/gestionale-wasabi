import { z } from "zod";

export const PaginationRequestSchema = z.object({
  page: z.number().default(0),
  pageSize: z.number().default(10),
});

export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;

export const PaginationResponseSchema = z.object({
  totalCount: z.number(),
});
