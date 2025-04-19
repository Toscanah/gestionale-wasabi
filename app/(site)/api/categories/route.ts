import { NextRequest } from "next/server";
import { z } from "zod";
import getCategories from "../../sql/categories/getCategories";
import createNewCategory from "../../sql/categories/createNewCategory";
import updateCategory from "../../sql/categories/updateCategory";
import toggleCategory from "../../sql/categories/toggleCategory";
import handleRequest from "../util/handleRequest";
import { CATEGORY_SCHEMAS } from "../../shared/schemas/category";


const POST_ACTIONS = new Map([
  ["createNewCategory", { func: createNewCategory, schema: CATEGORY_SCHEMAS.createNewCategory }],
  ["toggleCategory", { func: toggleCategory, schema: CATEGORY_SCHEMAS.toggleCategory }],
]);

const PATCH_ACTIONS = new Map([
  ["updateCategory", { func: updateCategory, schema: CATEGORY_SCHEMAS.updateCategory }],
]);

const GET_ACTIONS = new Map([
  ["getCategories", { func: getCategories, schema: CATEGORY_SCHEMAS.getCategories }],
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
