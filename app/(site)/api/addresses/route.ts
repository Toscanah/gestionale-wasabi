import { NextRequest } from "next/server";
import createAddress from "../../sql/addresses/createAddress";
import updateAddress from "../../sql/addresses/updateAddress";
import getAddressesByCustomer from "../../sql/addresses/getAddressesByCustomer";
import getLastAddressOfCustomer from "../../sql/addresses/getLastAddressOfCustomer";
import handleRequest from "../util/handleRequest";
import { ADDRESS_SCHEMAS } from "@shared";

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
