import { NextRequest } from "next/server";
import {
  MarketingOnCustomerWithMarketingSchema,
  MarketingTemplateInputSchema,
  NoContentSchema,
  SendMarketingToCustomersSchema,
} from "../../models";
import getMarketingTemplates from "../../sql/marketing/getMarketingTemplates";
import handleRequest from "../util/handleRequest";
import sendMarketingToCustomers from "../../sql/marketing/sendMarketingToCustomers";
import z from "zod";
import deleteMarketing from "../../sql/marketing/deleteMarketing";
import { MarketingTemplateSchema } from "@/prisma/generated/zod";
import addMarketingTemplate from "../../sql/marketing/addMarketingTemplate";
import updateMarketingTemplate from "../../sql/marketing/updateMarketingTemplate";

export const marketingSchemas = {
  getMarketingTemplates: NoContentSchema,
  sendMarketingToCustomers: SendMarketingToCustomersSchema,
  deleteMarketing: z.object({
    marketing: MarketingOnCustomerWithMarketingSchema,
  }),
  addMarketingTemplate: z.object({
    marketing: MarketingTemplateInputSchema,
  }),
  updateMarketingTemplate: z.object({
    marketing: MarketingTemplateSchema,
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
  [
    "addMarketingTemplate",
    { func: addMarketingTemplate, schema: marketingSchemas.addMarketingTemplate },
  ],
]);

const PATCH_ACTIONS = new Map([
  [
    "updateMarketingTemplate",
    { func: updateMarketingTemplate, schema: marketingSchemas.updateMarketingTemplate },
  ],
]);

const DELETE_ACTIONS = new Map([
  ["deleteMarketing", { func: deleteMarketing, schema: marketingSchemas.deleteMarketing }],
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
