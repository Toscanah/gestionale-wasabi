import { NextRequest } from "next/server";
import getRemainingRice from "../../sql/rice/getRemainingRice";
import updateRice from "../../sql/rice/updateRice";
import getTotalRice from "../../sql/rice/getTotalRice";
import resetRice from "../../sql/rice/resetRice";
import { z } from "zod";
import handleRequest from "../util/handleRequest";
import { RiceSchema } from "@/prisma/generated/zod";
import { NoContentSchema } from "../../models";

export const riceSchemas = {
  getRemainingRice: NoContentSchema,
  getTotalRice: NoContentSchema,
  updateRice: z.object({
    rice: RiceSchema.optional()
  }),
  resetRice: NoContentSchema,
};

const POST_ACTIONS = new Map([
  ["updateRice", { func: updateRice, schema: riceSchemas.updateRice }],
  ["resetRice", { func: resetRice, schema: riceSchemas.resetRice }],
]);

const GET_ACTIONS = new Map([
  ["getRemainingRice", { func: getRemainingRice, schema: riceSchemas.getRemainingRice }],
  ["getTotalRice", { func: getTotalRice, schema: riceSchemas.getTotalRice }],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}
