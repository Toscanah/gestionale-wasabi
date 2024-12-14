import { NextRequest, NextResponse } from "next/server";
import getAllOptions from "../../sql/options/getAllOptions";
import updateOptionsOfCategory from "../../sql/options/updateOptionsOfCategory";
import getAllOptionsWithCategories from "../../sql/options/getAllOptionsWithCategories";
import updateOption from "../../sql/options/updateOption";
import createNewOption from "../../sql/options/createNewOption";
import toggleOption from "../../sql/options/toggleOption";
import handleRequest from "../util/handleRequest";
import { z } from "zod";
import { OptionSchema } from "@/prisma/generated/zod";
import { UpdateOptionsOfCategorySchema } from "../../models";

export const optionSchemas = {
  getAllOptions: z.undefined(),
  getAllOptionsWithCategories: z.undefined(),
  updateOptionsOfCategory: UpdateOptionsOfCategorySchema,
  updateOption: z.object({
    option: OptionSchema,
  }),
  createNewOption: z.object({
    newOption: OptionSchema,
  }),
  toggleOption: z.object({
    id: z.number(),
  }),
};

const POST_ACTIONS = new Map([
  [
    "updateOptionsOfCategory",
    { func: updateOptionsOfCategory, schema: optionSchemas.updateOptionsOfCategory },
  ],
  ["updateOption", { func: updateOption, schema: optionSchemas.updateOption }],
  ["createNewOption", { func: createNewOption, schema: optionSchemas.createNewOption }],
  ["toggleOption", { func: toggleOption, schema: optionSchemas.toggleOption }],
]);

const GET_ACTIONS = new Map([
  ["getAllOptions", { func: getAllOptions, schema: optionSchemas.getAllOptions }],
  [
    "getAllOptionsWithCategories",
    { func: getAllOptionsWithCategories, schema: optionSchemas.getAllOptionsWithCategories },
  ],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}
