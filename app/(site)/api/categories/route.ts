import { NextRequest } from "next/server";
import { z } from "zod";
import getCategories from "../../sql/categories/getCategories";
import createNewCategory from "../../sql/categories/createNewCategory";
import updateCategory from "../../sql/categories/updateCategory";
import toggleCategory from "../../sql/categories/toggleCategory";
import handleRequest from "../util/handleRequest";
import { CategoryWithOptionsSchema, CreateCategorySchema, NoContentSchema, UpdateCategorySchema } from "../../models";

export const categorySchemas = {
  getCategories: NoContentSchema,
  updateCategory: z.object({
    category: UpdateCategorySchema,
  }),
  createNewCategory: z.object({
    category: CreateCategorySchema,
  }),
  toggleCategory: z.object({
    id: z.number(),
  }),
};

const POST_ACTIONS = new Map([
  ["createNewCategory", { func: createNewCategory, schema: categorySchemas.createNewCategory }],
  ["toggleCategory", { func: toggleCategory, schema: categorySchemas.toggleCategory }],
]);

const PATCH_ACTIONS = new Map([
  ["updateCategory", { func: updateCategory, schema: categorySchemas.updateCategory }],
]);

const GET_ACTIONS = new Map([
  ["getCategories", { func: getCategories, schema: categorySchemas.getCategories }],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function PATCH(request: NextRequest) {
  return await handleRequest(request, "PATCH", PATCH_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}
