import { ActionsMapRecord } from "../../lib/api/createHandler";
import getDailyRiceUsage from "../../lib/db/rice/getDailyRiceUsage";
import getRiceBatches from "../../lib/db/rice/getRiceBatches";
import getRiceLogs from "../../lib/db/rice/getRiceLogs";
import addRiceBatch from "../../lib/db/rice/addRiceBatch";
import addRiceLog from "../../lib/db/rice/addRiceLog";
import updateRiceBatch from "../../lib/db/rice/updateRiceBatch";
import deleteRiceBatch from "../../lib/db/rice/deleteRiceBatch";
import { RICE_REQUESTS } from "../../lib/shared/schemas/rice";

const POST_ACTIONS = new Map([
  ["addRiceBatch", { func: addRiceBatch, schema: RICE_REQUESTS.addRiceBatch }],
  ["addRiceLog", { func: addRiceLog, schema: RICE_REQUESTS.addRiceLog }],
]);

const PATCH_ACTIONS = new Map([
  ["updateRiceBatch", { func: updateRiceBatch, schema: RICE_REQUESTS.updateRiceBatch }],
]);

const GET_ACTIONS = new Map([
  ["getDailyRiceUsage", { func: getDailyRiceUsage, schema: RICE_REQUESTS.getDailyRiceUsage }],
  ["getRiceBatches", { func: getRiceBatches, schema: RICE_REQUESTS.getRiceBatches }],
  ["getRiceLogs", { func: getRiceLogs, schema: RICE_REQUESTS.getRiceLogs }],
]);

const DELETE_ACTIONS = new Map([
  ["deleteRiceBatch", { func: deleteRiceBatch, schema: RICE_REQUESTS.deleteRiceBatch }],
]);

export const RICE_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  GET: GET_ACTIONS,
  DELETE: DELETE_ACTIONS,
};
