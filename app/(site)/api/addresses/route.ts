import { NextRequest } from "next/server";
import createAddress from "../../sql/addresses/createAddress";
import updateAddress from "../../sql/addresses/updateAddress";
import getAddressesByCustomer from "../../sql/addresses/getAddressesByCustomer";
import getLastAddressOfCustomer from "../../sql/addresses/getLastAddressOfCustomer";
import { z } from "zod";
import handleRequest from "../util/handleRequest";
import { CreateAddressInputSchema, UpdateAddressInputSchema } from "../../models";

export const addressSchemas = {
  createAddress: z.object({
    address: CreateAddressInputSchema,
  }),
  updateAddress: z.object({
    address: UpdateAddressInputSchema,
  }),
  getAddressesByCustomer: z.object({
    customerId: z.number(),
  }),
  getLastAddressOfCustomer: z.object({
    phone: z.string(),
  }),
};

const POST_ACTIONS = new Map([
  ["createAddress", { func: createAddress, schema: addressSchemas.createAddress }],
]);

const PATCH_ACTIONS = new Map([
  ["updateAddress", { func: updateAddress, schema: addressSchemas.updateAddress }],
]);

const GET_ACTIONS = new Map([
  [
    "getAddressesByCustomer",
    { func: getAddressesByCustomer, schema: addressSchemas.getAddressesByCustomer },
  ],
  [
    "getLastAddressOfCustomer",
    { func: getLastAddressOfCustomer, schema: addressSchemas.getLastAddressOfCustomer },
  ],
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
