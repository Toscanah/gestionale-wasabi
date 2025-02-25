import { NextRequest } from "next/server";
import { NoContentSchema, SendMarketingToCustomersSchema } from "../../models";
import getMarketingTemplates from "../../sql/marketing-templates/getMarketingTemplates";
import handleRequest from "../util/handleRequest";
import sendMarketingToCustomers from "../../sql/marketing-templates/sendMarketingToCustomers";

export const marketingSchemas = {
  getMarketingTemplates: NoContentSchema,
  sendMarketingToCustomers: SendMarketingToCustomersSchema,
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

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}
