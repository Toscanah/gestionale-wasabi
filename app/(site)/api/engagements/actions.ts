import { ActionsMapRecord } from "../../lib/api/createHandler";
import createEngagement from "../../lib/db/engagement/createEngagement";
import getEngagementTemplates from "../../lib/db/engagement/templates/getEngagementTemplates";
import updateEngagementTemplate from "../../lib/db/engagement/templates/updateEngagementTemplate";
import createEngagementTemplate from "../../lib/db/engagement/templates/createEngagementTemplate";
import deleteTemplateById from "../../lib/db/engagement/templates/deleteTemplateById";
import deleteEngagementById from "../../lib/db/engagement/deleteEngagementById";
import toggleEngagementById from "../../lib/db/engagement/toggleEngagementById";
import { ENGAGEMENT_SCHEMAS } from "../../lib/shared";
import getEngagementsLedgersByCustomer from "../../lib/db/engagement/ledgers/getEngagementsLedgersByCustomer";
import issueLedgers from "../../lib/db/engagement/ledgers/issueLedgers";
import updateLedgerStatus from "../../lib/db/engagement/ledgers/updateLedgerStatus";

const GET_ACTIONS = new Map([
  [
    "getEngagementTemplates",
    { func: getEngagementTemplates, schema: ENGAGEMENT_SCHEMAS.getEngagementTemplates },
  ],
  [
    "getEngagementsLedgersByCustomer",
    {
      func: getEngagementsLedgersByCustomer,
      schema: ENGAGEMENT_SCHEMAS.getEngagementsLedgersByCustomer,
    },
  ],
]);

const POST_ACTIONS = new Map([
  ["createEngagement", { func: createEngagement, schema: ENGAGEMENT_SCHEMAS.createEngagement }],
  [
    "createEngagementTemplate",
    { func: createEngagementTemplate, schema: ENGAGEMENT_SCHEMAS.createEngagementTemplate },
  ],
  ["issueLedgers", { func: issueLedgers, schema: ENGAGEMENT_SCHEMAS.issueLedgers }],
]);

const PATCH_ACTIONS = new Map([
  [
    "updateEngagementTemplate",
    { func: updateEngagementTemplate, schema: ENGAGEMENT_SCHEMAS.updateEngagementTemplate },
  ],
  [
    "toggleEngagementById",
    { func: toggleEngagementById, schema: ENGAGEMENT_SCHEMAS.toggleEngagementById },
  ],
  [
    "updateLedgerStatus",
    { func: updateLedgerStatus, schema: ENGAGEMENT_SCHEMAS.updateLedgerStatus },
  ],
]);

const DELETE_ACTIONS = new Map([
  [
    "deleteTemplateById",
    { func: deleteTemplateById, schema: ENGAGEMENT_SCHEMAS.deleteTemplateById },
  ],
  [
    "deleteEngagementById",
    { func: deleteEngagementById, schema: ENGAGEMENT_SCHEMAS.deleteEngagementById },
  ],
]);

export const ENGAGEMENT_ACTIONS: ActionsMapRecord = {
  GET: GET_ACTIONS,
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  DELETE: DELETE_ACTIONS,
};
