import { CategorySchema, OptionSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import {
  createInputSchema,
  NoContentSchema,
  ToggleDeleteObjectSchema,
  updateInputSchema,
  wrapSchema,
} from "./common";
import { SchemaInputs } from "../types/SchemaInputs";

export const UpdateOptionsOfCategorySchema = z.object({
  category: CategorySchema,
  options: z.array(OptionSchema),
});

export const UpdateOptionSchema = wrapSchema("option", updateInputSchema(OptionSchema));
export const CreateOptionSchema = wrapSchema("option", createInputSchema(OptionSchema));

export const OPTION_SCHEMAS = {
  getAllOptions: NoContentSchema,
  getAllOptionsWithCategories: NoContentSchema,
  updateOptionsOfCategory: UpdateOptionsOfCategorySchema,
  updateOption: UpdateOptionSchema,
  createNewOption: CreateOptionSchema,
  toggleOption: ToggleDeleteObjectSchema,
};

export type OptionSchemaInputs = SchemaInputs<typeof OPTION_SCHEMAS>;
