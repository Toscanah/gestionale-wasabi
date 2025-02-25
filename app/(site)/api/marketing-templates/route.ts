import { NextRequest } from "next/server";
import { NoContentSchema } from "../../models";
import getMarketingTemplates from "../../sql/marketing-templates/getMarketingTemplates";
import handleRequest from "../util/handleRequest";

export const marketingSchemas = {
  getMarketingTemplates: NoContentSchema,
};

const GET_ACTIONS = new Map([
  [
    "getMarketingTemplates",
    { func: getMarketingTemplates, schema: marketingSchemas.getMarketingTemplates },
  ],
]);

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}
