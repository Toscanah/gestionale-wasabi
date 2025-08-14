import { ActionsMapRecord } from "../../lib/api/createHandler";
import sendMetaMessage from "../../lib/integrations/meta/sendMetaMessage";
import { getTemplates as getMetaTemplates } from "../../lib/integrations/meta/getTemplates";
import { META_SCHEMAS } from "../../lib/shared";

const POST_ACTIONS = new Map([
  ["sendMetaMessage", { func: sendMetaMessage, schema: META_SCHEMAS.sendMetaMessage }],
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
