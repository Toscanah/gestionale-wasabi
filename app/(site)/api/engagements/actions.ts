import { ActionsMapRecord } from "../../lib/api/createHandler";
import createEngagement from "../../lib/db/engagement/createEngagement";
import getEngagementTemplates from "../../lib/db/engagement/templates/getEngagementTemplates";
import updateEngagementTemplate from "../../lib/db/engagement/templates/updateEngagementTemplate";
import createEngagementTemplate from "../../lib/db/engagement/templates/createEngagementTemplate";
import deleteTemplateById from "../../lib/db/engagement/templates/deleteTemplateById";
import deleteEngagementById from "../../lib/db/engagement/deleteEngagementById";
import toggleEngagementById from "../../lib/db/engagement/toggleEngagementById";
import { ENGAGEMENT_REQUESTS } from "../../lib/shared";
import getEngagementsLedgersByCustomer from "../../lib/db/engagement/ledgers/getEngagementsLedgersByCustomer";
import issueLedgers from "../../lib/db/engagement/ledgers/issueLedgers";
import updateLedgerStatus from "../../lib/db/engagement/ledgers/updateLedgerStatus";

const GET_ACTIONS = new Map([
  [
    "getEngagementTemplates",
    { func: getEngagementTemplates, schema: ENGAGEMENT_REQUESTS.getEngagementTemplates },
  ],
  [
    "getEngagementsLedgersByCustomer",
    {
      func: getEngagementsLedgersByCustomer,
      schema: ENGAGEMENT_REQUESTS.getEngagementsLedgersByCustomer,
    },
  ],
]);

const POST_ACTIONS = new Map([
  ["createEngagement", { func: createEngagement, schema: ENGAGEMENT_REQUESTS.createEngagement }],
  [
    "createEngagementTemplate",
    { func: createEngagementTemplate, schema: ENGAGEMENT_REQUESTS.createEngagementTemplate },
  ],
  ["issueLedgers", { func: issueLedgers, schema: ENGAGEMENT_REQUESTS.issueLedgers }],
]);

const PATCH_ACTIONS = new Map([
  [
    "updateEngagementTemplate",
    { func: updateEngagementTemplate, schema: ENGAGEMENT_REQUESTS.updateEngagementTemplate },
  ],
  [
    "toggleEngagementById",
    { func: toggleEngagementById, schema: ENGAGEMENT_REQUESTS.toggleEngagementById },
  ],
  [
    "updateLedgerStatus",
    { func: updateLedgerStatus, schema: ENGAGEMENT_REQUESTS.updateLedgerStatus },
  ],
]);

const DELETE_ACTIONS = new Map([
  [
    "deleteTemplateById",
    { func: deleteTemplateById, schema: ENGAGEMENT_REQUESTS.deleteTemplateById },
  ],
  [
    "deleteEngagementById",
    { func: deleteEngagementById, schema: ENGAGEMENT_REQUESTS.deleteEngagementById },
  ],
]);

export const ENGAGEMENT_ACTIONS: ActionsMapRecord = {
  GET: GET_ACTIONS,
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  DELETE: DELETE_ACTIONS,
};
