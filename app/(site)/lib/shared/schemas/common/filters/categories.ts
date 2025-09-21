import z from "zod";

export const CategoriesFilterSchema = z.object({
  categoryIds: z.array(z.number().min(1, "Category ID must be at least 1")),
});

export type CategoriesFilter = z.infer<typeof CategoriesFilterSchema>;