import { NextRequest } from "next/server";
import createAddress from "../../lib/db/addresses/createAddress";
import updateAddress from "../../lib/db/addresses/updateAddress";
import getAddressesByCustomer from "../../lib/db/addresses/getAddressesByCustomer";
import getLastAddressOfCustomer from "../../lib/db/addresses/getLastAddressOfCustomer";
import handleRequest from "../../lib/api/handleRequest";
import { ADDRESS_SCHEMAS } from "@/app/(site)/lib/shared";

const POST_ACTIONS = new Map([
  ["createAddress", { func: createAddress, schema: ADDRESS_SCHEMAS.createAddress }],
]);

const PATCH_ACTIONS = new Map([
  ["updateAddress", { func: updateAddress, schema: ADDRESS_SCHEMAS.updateAddress }],
]);

const GET_ACTIONS = new Map([
  [
    "getAddressesByCustomer",
    { func: getAddressesByCustomer, schema: ADDRESS_SCHEMAS.getAddressesByCustomer },
  ],
  [
    "getLastAddressOfCustomer",
    { func: getLastAddressOfCustomer, schema: ADDRESS_SCHEMAS.getLastAddressOfCustomer },
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
