import { NextRequest } from "next/server";
import handleRequest from "../../lib/api/handleRequest";
import createEngagement from "../../lib/db/engagement/createEngagement";
import { ENGAGEMENT_SCHEMAS } from "../../lib/shared";
import getEngagementTemplates from "../../lib/db/engagement/templates/getEngagementTemplates";
import updateEngagementTemplate from "../../lib/db/engagement/templates/updateEngagementTemplate";
import createEngagementTemplate from "../../lib/db/engagement/templates/createEngagementTemplate";
import deleteTemplateById from "../../lib/db/engagement/templates/deleteTemplateById";
import deleteEngagementById from "../../lib/db/engagement/deleteEngagementById";
import toggleEngagementById from "../../lib/db/engagement/toggleEngagementById";

const GET_ACTIONS = new Map([
  // [
  //   "getEngagementsByCustomer",
  //   { func: createEngagement, schema: ENGAGEMENT_SCHEMAS.getEngagementsByCustomer },
  // ],
  [
    "getEngagementTemplates",
    { func: getEngagementTemplates, schema: ENGAGEMENT_SCHEMAS.getEngagementTemplates },
  ],
]);

const POST_ACTIONS = new Map([
  ["createEngagement", { func: createEngagement, schema: ENGAGEMENT_SCHEMAS.createEngagement }],
  [
    "createEngagementTemplate",
    { func: createEngagementTemplate, schema: ENGAGEMENT_SCHEMAS.createEngagementTemplate },
  ],
]);

const PATCH_ACTIONS = new Map([
  [
    "updateEngagementTemplate",
    { func: updateEngagementTemplate, schema: ENGAGEMENT_SCHEMAS.updateEngagementTemplate },
  ],
  [
    "toggleEngagementById",
    {
      func: toggleEngagementById,
      schema: ENGAGEMENT_SCHEMAS.toggleEngagementById,
    },
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

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

export async function PATCH(request: NextRequest) {
  return await handleRequest(request, "PATCH", PATCH_ACTIONS);
}

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}
