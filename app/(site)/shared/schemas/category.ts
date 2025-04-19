import { z } from "zod";
import { CategorySchema } from "@/prisma/generated/zod";
import { NoContentSchema } from "./Schemas";
import { CategoryWithOptionsSchema } from "../models";

export const CreateCategorySchema = CategoryWithOptionsSchema.omit({ id: true }).partial({
  options: true,
});

export const UpdateCategorySchema = CategoryWithOptionsSchema.omit({ active: true });

export const ToggleCategorySchema = z.object({
  id: z.number(),
});

export const CATEGORY_SCHEMAS = {
  createNewCategory: CreateCategorySchema,
  updateCategory: UpdateCategorySchema,
  toggleCategory: ToggleCategorySchema,
  getCategories: NoContentSchema,
};
