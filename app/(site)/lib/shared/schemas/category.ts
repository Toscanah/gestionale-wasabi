import { CategorySchema } from "@/prisma/generated/zod";
import { CategoryWithOptionsSchema } from "../models/_index";
import { ApiContract } from "../types/api-contract";
import { NoContentRequestSchema } from "./common/no-content";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { createInputSchema, updateInputSchema } from "./common/utils";
import { z } from "zod";

export const CreateCategoryRequestSchema = createInputSchema(CategoryWithOptionsSchema).partial({
  options: true,
});

export const UpdateCategoryRequestSchema = updateInputSchema(CategoryWithOptionsSchema);

export const ToggleCategoryRequestSchema = ToggleDeleteEntityRequestSchema;

export const CATEGORY_REQUESTS = {
  createNewCategory: CreateCategoryRequestSchema,
  updateCategory: UpdateCategoryRequestSchema,
  toggleCategory: ToggleCategoryRequestSchema,
  getCategories: NoContentRequestSchema,
};

export const GetCategoriesResponseSchema = z.array(CategorySchema);

export const CATEGORY_RESPONSES = {
  getCategories: GetCategoriesResponseSchema,
};

export type CategoryContract = ApiContract<typeof CATEGORY_REQUESTS, typeof CATEGORY_RESPONSES>;
