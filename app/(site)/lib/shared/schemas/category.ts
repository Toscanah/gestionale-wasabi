import { CategoryWithOptionsSchema } from "../models/_index";
import { SchemaInputs } from "../types/SchemaInputs";
import {
  createInputSchema,
  NoContentSchema,
  ToggleDeleteObjectSchema,
  updateInputSchema,
} from "./common";

export const CreateCategorySchema = createInputSchema(CategoryWithOptionsSchema).partial({
  options: true,
});

export const UpdateCategorySchema = updateInputSchema(CategoryWithOptionsSchema);

export const ToggleCategorySchema = ToggleDeleteObjectSchema;

export const CATEGORY_SCHEMAS = {
  createNewCategory: CreateCategorySchema,
  updateCategory: UpdateCategorySchema,
  toggleCategory: ToggleCategorySchema,
  getCategories: NoContentSchema,
};

export type CategorySchemaInputs = SchemaInputs<typeof CATEGORY_SCHEMAS>;