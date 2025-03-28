import { NextRequest } from "next/server";
import getCustomerByPhone from "../../sql/customers/getCustomerByPhone";
import createCustomer from "../../sql/customers/createCustomer";
import toggleCustomer from "../../sql/customers/toggleCustomer";
import getCustomersWithDetails from "../../sql/customers/getCustomersWithDetails";
import updateAddressesOfCustomer from "../../sql/customers/updateAddressesOfCustomer";
import updateCustomerFromOrder from "../../sql/customers/updateCustomerFromOrder";
import getCustomerWithDetails from "../../sql/customers/getCustomerWithDetails";
import updateCustomerFromAdmin from "../../sql/customers/updateCustomerFromAdmin";
import getCustomersByDoorbell from "../../sql/customers/getCustomersByDoorbell";
import { z } from "zod";
import { CreateCustomerInputSchema, NoContentSchema } from "../../models";
import { AddressSchema, CustomerSchema } from "@/prisma/generated/zod";
import handleRequest from "../util/handleRequest";
import deleteCustomerById from "../../sql/customers/deleteCustomerById";
import getCustomersWithStats from "../../sql/customers/getCustomersWithStats";
// import getCustomersWithMarketing from "../../sql/customers/getCustomersWithMarketing.ts.disabled";

export const customerSchemas = {
  getCustomerByPhone: z.object({ phone: z.string() }),
  getCustomerWithDetails: z.object({ customerId: z.number() }),
  getCustomersWithDetails: NoContentSchema,
  getCustomersByDoorbell: z.object({ doorbell: z.string() }),
  updateCustomerFromAdmin: z.object({
    customer: CustomerSchema.extend({ phone: z.string() }),
  }),
  updateCustomerFromOrder: z.object({
    customer: CustomerSchema,
  }),
  createCustomer: z.object({
    customer: CreateCustomerInputSchema,
  }),
  toggleCustomer: z.object({ id: z.number() }),
  updateAddressesOfCustomer: z.object({
    addresses: z.array(AddressSchema),
    customerId: z.number(),
  }),
  deleteCustomerById: z.object({
    id: z.number(),
  }),
  getCustomersWithStats: z.object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
  getCustomersWithMarketing: NoContentSchema,
};

const POST_ACTIONS = new Map([
  ["createCustomer", { func: createCustomer, schema: customerSchemas.createCustomer }],
]);

const PATCH_ACTIONS = new Map([
  [
    "updateCustomerFromAdmin",
    { func: updateCustomerFromAdmin, schema: customerSchemas.updateCustomerFromAdmin },
  ],
  [
    "updateCustomerFromOrder",
    { func: updateCustomerFromOrder, schema: customerSchemas.updateCustomerFromOrder },
  ],
  ["toggleCustomer", { func: toggleCustomer, schema: customerSchemas.toggleCustomer }],
  [
    "updateAddressesOfCustomer",
    { func: updateAddressesOfCustomer, schema: customerSchemas.updateAddressesOfCustomer },
  ],
]);

const DELETE_ACTIONS = new Map([
  ["deleteCustomerById", { func: deleteCustomerById, schema: customerSchemas.deleteCustomerById }],
]);

const GET_ACTIONS = new Map([
  ["getCustomerByPhone", { func: getCustomerByPhone, schema: customerSchemas.getCustomerByPhone }],
  [
    "getCustomersWithDetails",
    { func: getCustomersWithDetails, schema: customerSchemas.getCustomersWithDetails },
  ],
  [
    "getCustomerWithDetails",
    { func: getCustomerWithDetails, schema: customerSchemas.getCustomerWithDetails },
  ],
  [
    "getCustomersByDoorbell",
    { func: getCustomersByDoorbell, schema: customerSchemas.getCustomersByDoorbell },
  ],
  [
    "getCustomersWithStats",
    { func: getCustomersWithStats, schema: customerSchemas.getCustomersWithStats },
  ],
  // [
  //   "getCustomersWithMarketing",
  //   { func: getCustomersWithMarketing, schema: customerSchemas.getCustomersWithMarketing },
  // ],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function PATCH(request: NextRequest) {
  return await handleRequest(request, "PATCH", PATCH_ACTIONS);
}

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}
