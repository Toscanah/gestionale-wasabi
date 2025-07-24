import { ActionsMapRecord } from "../../lib/api/createHandler";
import getAllOptions from "../../lib/db/options/getAllOptions";
import getAllOptionsWithCategories from "../../lib/db/options/getAllOptionsWithCategories";
import updateOption from "../../lib/db/options/updateOption";
import toggleOption from "../../lib/db/options/toggleOption";
import createNewOption from "../../lib/db/options/createNewOption";
import { OPTION_SCHEMAS } from "../../lib/shared/schemas/option";

const POST_ACTIONS = new Map([
  ["createNewOption", { func: createNewOption, schema: OPTION_SCHEMAS.createNewOption }],
]);

const PATCH_ACTIONS = new Map([
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

export const OPTION_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  GET: GET_ACTIONS,
};
