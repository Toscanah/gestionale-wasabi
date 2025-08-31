import createAddress from "../../lib/db/addresses/createAddress";
import updateAddress from "../../lib/db/addresses/updateAddress";
import getAddressesByCustomer from "../../lib/db/addresses/getAddressesByCustomer";
import getLastAddressOfCustomer from "../../lib/db/addresses/getLastAddressOfCustomer";
import { ADDRESS_REQUESTS } from "../../lib/shared";
import { ActionsMapRecord } from "../../lib/api/createHandler";

const POST_ACTIONS = new Map([
  ["createAddress", { func: createAddress, schema: ADDRESS_REQUESTS.createAddress }],
]);

const PATCH_ACTIONS = new Map([
  ["updateAddress", { func: updateAddress, schema: ADDRESS_REQUESTS.updateAddress }],
]);

const GET_ACTIONS = new Map([
  [
    "getAddressesByCustomer",
    { func: getAddressesByCustomer, schema: ADDRESS_REQUESTS.getAddressesByCustomer },
  ],
  [
    "getLastAddressOfCustomer",
    { func: getLastAddressOfCustomer, schema: ADDRESS_REQUESTS.getLastAddressOfCustomer },
  ],
]);

export const ADDRESS_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  GET: GET_ACTIONS,
};
