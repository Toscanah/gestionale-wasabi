import { NextRequest } from "next/server";
import {
  MarketingOnCustomerWithMarketingSchema,
  NoContentSchema,
  SendMarketingToCustomersSchema,
} from "../../models";
import getMarketingTemplates from "../../sql/marketing/getMarketingTemplates";
import handleRequest from "../util/handleRequest";
import sendMarketingToCustomers from "../../sql/marketing/sendMarketingToCustomers";
import z from "zod";
import deleteMarketing from "../../sql/marketing/deleteMarketing";

export const marketingSchemas = {
  getMarketingTemplates: NoContentSchema,
  sendMarketingToCustomers: SendMarketingToCustomersSchema,
  deleteMarketing: z.object({
    marketing: MarketingOnCustomerWithMarketingSchema,
  }),
};

const GET_ACTIONS = new Map([
  [
    "getMarketingTemplates",
    { func: getMarketingTemplates, schema: marketingSchemas.getMarketingTemplates },
  ],
]);

const POST_ACTIONS = new Map([
  [
    "sendMarketingToCustomers",
    { func: sendMarketingToCustomers, schema: marketingSchemas.sendMarketingToCustomers },
  ],
]);

const DELETE_ACTIONS = new Map([
  ["deleteMarketing", { func: deleteMarketing, schema: marketingSchemas.deleteMarketing }],
]);

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}
