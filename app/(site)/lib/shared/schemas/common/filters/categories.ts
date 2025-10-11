import z from "zod";

export const CategoriesFilterSchema = z.object({
  categoryIds: z
    .array(
      z.number().refine(id => id === -1 || id > 0, {
        message: "Only -1 or positive numbers are allowed",
      })
    ),
});

export type CategoriesFilter = z.infer<typeof CategoriesFilterSchema>;