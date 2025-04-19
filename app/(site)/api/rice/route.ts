import { NextRequest } from "next/server";
import getDailyRiceUsage from "../../sql/rice/getDailyRiceUsage";
import handleRequest from "../util/handleRequest";
import getRiceBatches from "../../sql/rice/getRiceBatches";
import addRiceBatch from "../../sql/rice/addRiceBatch";
import updateRiceBatch from "../../sql/rice/updateRiceBatch";
import deleteRiceBatch from "../../sql/rice/deleteRiceBatch";
import getRiceLogs from "../../sql/rice/getRiceLogs";
import addRiceLog from "../../sql/rice/addRiceLog";
import { RICE_SCHEMAS } from "../../shared/schemas/rice";

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
