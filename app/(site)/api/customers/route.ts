import { NextRequest } from "next/server";
import getCustomerByPhone from "../../lib/db/customers/getCustomerByPhone";
import createCustomer from "../../lib/db/customers/createCustomer";
import toggleCustomer from "../../lib/db/customers/toggleCustomer";
import getCustomersWithDetails from "../../lib/db/customers/getCustomersWithDetails";
import updateAddressesOfCustomer from "../../lib/db/customers/updateAddressesOfCustomer";
import updateCustomerFromOrder from "../../lib/db/customers/updateCustomerFromOrder";
import getCustomerWithDetails from "../../lib/db/customers/getCustomerWithDetails";
import updateCustomerFromAdmin from "../../lib/db/customers/updateCustomerFromAdmin";
import getCustomersByDoorbell from "../../lib/db/customers/getCustomersByDoorbell";
import { CUSTOMER_SCHEMAS } from "@/app/(site)/lib/shared";
import handleRequest from "../../lib/api/handleRequest";
import deleteCustomerById from "../../lib/db/customers/deleteCustomerById";
import getCustomersWithStats from "../../lib/db/customers/getCustomersWithStats";
// import getCustomersWithMarketing from "../../sql/customers/getCustomersWithMarketing.ts.disabled";

const POST_ACTIONS = new Map([
  ["createCustomer", { func: createCustomer, schema: CUSTOMER_SCHEMAS.createCustomer }],
]);

const PATCH_ACTIONS = new Map([
  [
    "updateCustomerFromAdmin",
    { func: updateCustomerFromAdmin, schema: CUSTOMER_SCHEMAS.updateCustomerFromAdmin },
  ],
  [
    "updateCustomerFromOrder",
    { func: updateCustomerFromOrder, schema: CUSTOMER_SCHEMAS.updateCustomerFromOrder },
  ],
  ["toggleCustomer", { func: toggleCustomer, schema: CUSTOMER_SCHEMAS.toggleCustomer }],
  [
    "updateAddressesOfCustomer",
    { func: updateAddressesOfCustomer, schema: CUSTOMER_SCHEMAS.updateAddressesOfCustomer },
  ],
]);

const DELETE_ACTIONS = new Map([
  ["deleteCustomerById", { func: deleteCustomerById, schema: CUSTOMER_SCHEMAS.deleteCustomerById }],
]);

const GET_ACTIONS = new Map([
  ["getCustomerByPhone", { func: getCustomerByPhone, schema: CUSTOMER_SCHEMAS.getCustomerByPhone }],
  [
    "getCustomersWithDetails",
    { func: getCustomersWithDetails, schema: CUSTOMER_SCHEMAS.getCustomersWithDetails },
  ],
  [
    "getCustomerWithDetails",
    { func: getCustomerWithDetails, schema: CUSTOMER_SCHEMAS.getCustomerWithDetails },
  ],
  [
    "getCustomersByDoorbell",
    { func: getCustomersByDoorbell, schema: CUSTOMER_SCHEMAS.getCustomersByDoorbell },
  ],
  [
    "getCustomersWithStats",
    { func: getCustomersWithStats, schema: CUSTOMER_SCHEMAS.getCustomersWithStats },
  ],
  // [
  //   "getCustomersWithMarketing",
  //   { func: getCustomersWithMarketing, schema: CUSTOMER_SCHEMAS.getCustomersWithMarketing },
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
