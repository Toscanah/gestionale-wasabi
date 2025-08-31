import { CategorySchema, OptionSchema } from "@/prisma/generated/zod";
import { z } from "zod";
import { createInputSchema, updateInputSchema, wrapSchema } from "./common/utils";
import { NoContentRequestSchema } from "./common/no-content";
import { ToggleDeleteEntityRequestSchema } from "./common/toggle-delete-entity";
import { ApiContract } from "../types/api-contract";

export const UpdateOptionsOfCategorySchema = z.object({
  category: CategorySchema,
  options: z.array(OptionSchema),
});

export const UpdateOptionSchema = wrapSchema("option", updateInputSchema(OptionSchema));
export const CreateOptionSchema = wrapSchema("option", createInputSchema(OptionSchema));

export const OPTION_REQUESTS = {
  getAllOptions: NoContentRequestSchema,
  getAllOptionsWithCategories: NoContentRequestSchema,
  updateOptionsOfCategory: UpdateOptionsOfCategorySchema,
  updateOption: UpdateOptionSchema,
  createNewOption: CreateOptionSchema,
  toggleOption: ToggleDeleteEntityRequestSchema,
};

export const OPTION_RESPONSES = {};

export type OptionContract = ApiContract<typeof OPTION_REQUESTS, typeof OPTION_RESPONSES>;
