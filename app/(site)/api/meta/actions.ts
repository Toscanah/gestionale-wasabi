import { ActionsMapRecord } from "../../lib/api/createHandler";
import sendMessage from "../../lib/integrations/meta/sendMessage";
import { getMetaTemplates } from "../../lib/integrations/meta/getMetaTemplates";
import { META_SCHEMAS } from "../../lib/shared";

const POST_ACTIONS = new Map([
  ["sendMessage", { func: sendMessage, schema: META_SCHEMAS.sendMessage }],
]);

const PATCH_ACTIONS = new Map();

const GET_ACTIONS = new Map([
  ["getMetaTemplates", { func: getMetaTemplates, schema: META_SCHEMAS.getMetaTemplates }],
]);

const DELETE_ACTIONS = new Map();

export const META_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  GET: GET_ACTIONS,
  DELETE: DELETE_ACTIONS,
};
