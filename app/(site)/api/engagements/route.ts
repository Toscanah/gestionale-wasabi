import { NextRequest } from "next/server";
import handleRequest from "../util/handleRequest";
import createEngagement from "../../sql/engagement/createEngagement";
import { ENGAGEMENT_SCHEMAS } from "../../shared";

const GET_ACTIONS = new Map([
  ["fetchEngagementsByCustomer", { func: createEngagement, schema: ENGAGEMENT_SCHEMAS.fetchEngagementsByCustomer }],
]);

const POST_ACTIONS = new Map([
  ["createEngagement", { func: createEngagement, schema: ENGAGEMENT_SCHEMAS.createEngagement }],
]);

const PATCH_ACTIONS = new Map([]);

const DELETE_ACTIONS = new Map([]);

// export async function GET(request: NextRequest) {
//   return await handleRequest(request, "GET", GET_ACTIONS);
// }

// export async function PATCH(request: NextRequest) {
//   return await handleRequest(request, "PATCH", PATCH_ACTIONS);
// }

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

// export async function DELETE(request: NextRequest) {
//   return await handleRequest(request, "DELETE", DELETE_ACTIONS);
// }
