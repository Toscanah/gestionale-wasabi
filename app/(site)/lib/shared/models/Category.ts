import { CategorySchema, OptionSchema } from "@/prisma/generated/schemas";
import { z } from "zod";

export const CategoryWithOptionsSchema = CategorySchema.extend({
  options: z.array(
    z.object({
      option: OptionSchema,
    })
  ),
});

export type CategoryWithOptions = z.infer<typeof CategoryWithOptionsSchema>;
