import { NextRequest } from "next/server";
import getAllOptions from "../../lib/db/options/getAllOptions";
import updateOptionsOfCategory from "../../lib/db/options/updateOptionsOfCategory";
import getAllOptionsWithCategories from "../../lib/db/options/getAllOptionsWithCategories";
import updateOption from "../../lib/db/options/updateOption";
import createNewOption from "../../lib/db/options/createNewOption";
import toggleOption from "../../lib/db/options/toggleOption";
import handleRequest from "../../lib/api/handleRequest";
import { OPTION_SCHEMAS } from "../../lib/shared/schemas/option";

const POST_ACTIONS = new Map([
  ["createNewOption", { func: createNewOption, schema: OPTION_SCHEMAS.createNewOption }],
]);

const PATCH_ACTIONS = new Map([
  // [
  //   "updateOptionsOfCategory",
  //   { func: updateOptionsOfCategory, schema: optionSchemas.updateOptionsOfCategory },
  // ],
  ["updateOption", { func: updateOption, schema: OPTION_SCHEMAS.updateOption }],
  ["toggleOption", { func: toggleOption, schema: OPTION_SCHEMAS.toggleOption }],
]);

const GET_ACTIONS = new Map([
  ["getAllOptions", { func: getAllOptions, schema: OPTION_SCHEMAS.getAllOptions }],
  [
    "getAllOptionsWithCategories",
    { func: getAllOptionsWithCategories, schema: OPTION_SCHEMAS.getAllOptionsWithCategories },
  ],
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
