import { ActionsMapRecord } from "../../lib/api/createHandler";
import getCustomerByPhone from "../../lib/db/customers/getCustomerByPhone";
import createCustomer from "../../lib/db/customers/createCustomer";
import toggleCustomer from "../../lib/db/customers/toggleCustomer";
import getCustomersWithDetails from "../../lib/db/customers/getCustomersWithDetails";
import updateCustomerAddresses from "../../lib/db/customers/updateCustomerAddresses";
import updateCustomerFromOrder from "../../lib/db/customers/updateCustomerFromOrder";
import getCustomerWithDetails from "../../lib/db/customers/getCustomerWithDetails";
import updateCustomerFromAdmin from "../../lib/db/customers/updateCustomerFromAdmin";
import getCustomersByDoorbell from "../../lib/db/customers/getCustomersByDoorbell";
import deleteCustomerById from "../../lib/db/customers/deleteCustomerById";
import computeCustomersStats from "../../lib/db/customers/computeCustomersStats";
import { CUSTOMER_SCHEMAS } from "../../lib/shared";
import updateCustomerOrderNotes from "../../lib/db/customers/updateCustomerOrderNotes";
import updateCustomersRFM from "../../lib/db/customers/updateCustomerRFM";

const POST_ACTIONS = new Map([
  ["createCustomer", { func: createCustomer, schema: CUSTOMER_SCHEMAS.createCustomer }],
  [
    "computeCustomersStats",
    { func: computeCustomersStats, schema: CUSTOMER_SCHEMAS.computeCustomersStats },
  ],
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
    "updateCustomerAddresses",
    { func: updateCustomerAddresses, schema: CUSTOMER_SCHEMAS.updateCustomerAddresses },
  ],
  [
    "updateCustomerOrderNotes",
    { func: updateCustomerOrderNotes, schema: CUSTOMER_SCHEMAS.updateCustomerOrderNotes },
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
]);

export const CUSTOMER_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  DELETE: DELETE_ACTIONS,
  GET: GET_ACTIONS,
};
