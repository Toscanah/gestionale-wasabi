import { NextRequest } from "next/server";
import getDailyRiceUsage from "../../sql/rice/getDailyRiceUsage";
import { z } from "zod";
import handleRequest from "../util/handleRequest";
import { RiceBatchSchema } from "@/prisma/generated/zod";
import { NoContentSchema } from "../../models";
import getRiceBatches from "../../sql/rice/getRiceBatches";
import addRiceBatch from "../../sql/rice/addRiceBatch";
import updateRiceBatch from "../../sql/rice/updateRiceBatch";
import deleteRiceBatch from "../../sql/rice/deleteRiceBatch";
import getRiceLogs from "../../sql/rice/getRiceLogs";
import addRiceLog from "../../sql/rice/addRiceLog";

export const riceSchemas = {
  getDailyRiceUsage: NoContentSchema,
  getRiceBatches: NoContentSchema,
  addRiceBatch: z.object({
    batch: RiceBatchSchema.omit({ id: true }),
  }),
  deleteRiceBatch: z.object({
    batchId: z.number(),
  }),
  updateRiceBatch: z.object({
    batchId: z.number(),
    field: z.enum(["amount", "label"]),
    value: z.any(),
  }),
  getRiceLogs: NoContentSchema,
  addRiceLog: z.object({
    riceBatchId: z.number().nullable(),
    manualValue: z.number().nullable(),
  }),
};

const POST_ACTIONS = new Map([
  ["addRiceBatch", { func: addRiceBatch, schema: riceSchemas.addRiceBatch }],
  ["updateRiceBatch", { func: updateRiceBatch, schema: riceSchemas.updateRiceBatch }],
  ["addRiceLog", { func: addRiceLog, schema: riceSchemas.addRiceLog }],
]);

const GET_ACTIONS = new Map([
  ["getDailyRiceUsage", { func: getDailyRiceUsage, schema: riceSchemas.getDailyRiceUsage }],
  ["getRiceBatches", { func: getRiceBatches, schema: riceSchemas.getRiceBatches }],
  ["getRiceLogs", { func: getRiceLogs, schema: riceSchemas.getRiceLogs }],
]);

const DELETE_ACTIONS = new Map([
  ["deleteRiceBatch", { func: deleteRiceBatch, schema: riceSchemas.deleteRiceBatch }],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}
