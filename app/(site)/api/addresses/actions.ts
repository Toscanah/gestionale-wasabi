import createAddress from "../../lib/db/addresses/createAddress";
import updateAddress from "../../lib/db/addresses/updateAddress";
import getAddressesByCustomer from "../../lib/db/addresses/getAddressesByCustomer";
import getLastAddressOfCustomer from "../../lib/db/addresses/getLastAddressOfCustomer";
import { ADDRESS_SCHEMAS } from "../../lib/shared";
import { ActionsMapRecord } from "../../lib/api/createHandler";

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

export const ADDRESS_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  GET: GET_ACTIONS,
};
