import { NextRequest } from "next/server";
import getDailyRiceUsage from "../../lib/db/rice/getDailyRiceUsage";
import handleRequest from "../../lib/api/handleRequest";
import getRiceBatches from "../../lib/db/rice/getRiceBatches";
import addRiceBatch from "../../lib/db/rice/addRiceBatch";
import updateRiceBatch from "../../lib/db/rice/updateRiceBatch";
import deleteRiceBatch from "../../lib/db/rice/deleteRiceBatch";
import getRiceLogs from "../../lib/db/rice/getRiceLogs";
import addRiceLog from "../../lib/db/rice/addRiceLog";
import { RICE_SCHEMAS } from "../../lib/shared/schemas/rice";

const POST_ACTIONS = new Map([
  ["addRiceBatch", { func: addRiceBatch, schema: RICE_SCHEMAS.addRiceBatch }],
  ["addRiceLog", { func: addRiceLog, schema: RICE_SCHEMAS.addRiceLog }],
]);

const PATCH_ACTIONS = new Map([
  ["updateRiceBatch", { func: updateRiceBatch, schema: RICE_SCHEMAS.updateRiceBatch }],
]);

const GET_ACTIONS = new Map([
  ["getDailyRiceUsage", { func: getDailyRiceUsage, schema: RICE_SCHEMAS.getDailyRiceUsage }],
  ["getRiceBatches", { func: getRiceBatches, schema: RICE_SCHEMAS.getRiceBatches }],
  ["getRiceLogs", { func: getRiceLogs, schema: RICE_SCHEMAS.getRiceLogs }],
]);

const DELETE_ACTIONS = new Map([
  ["deleteRiceBatch", { func: deleteRiceBatch, schema: RICE_SCHEMAS.deleteRiceBatch }],
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

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}
