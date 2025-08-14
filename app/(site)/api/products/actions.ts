import { ActionsMapRecord } from "../../lib/api/createHandler";
import addProductToOrder from "../../lib/db/products/addProductToOrder";
import addProductsToOrder from "../../lib/db/products/addProductsToOrder";
import updateProductInOrder from "../../lib/db/products/product-in-order/updateProductInOrder";
import removeProductsFromOrder from "../../lib/db/products/removeProductsFromOrder";
import getProducts from "../../lib/db/products/getProducts";
import updateProduct from "../../lib/db/products/updateProduct";
import updateProductOptionsInOrder from "../../lib/db/products/updateProductOptionsInOrder";
import createNewProduct from "../../lib/db/products/createNewProduct";
import toggleProduct from "../../lib/db/products/toggleProduct";
import updatePrintedAmounts from "../../lib/db/products/updatePrintedAmounts";
import updateProductVariationInOrder from "../../lib/db/products/updateProductVariationInOrder";
import getProductsWithStats from "../../lib/db/products/getProductsWithStats";
import { PRODUCT_SCHEMAS } from "../../lib/shared/schemas/product";

const POST_ACTIONS = new Map([
  ["createNewProduct", { func: createNewProduct, schema: PRODUCT_SCHEMAS.createNewProduct }],
  ["addProductToOrder", { func: addProductToOrder, schema: PRODUCT_SCHEMAS.addProductToOrder }],
  ["addProductsToOrder", { func: addProductsToOrder, schema: PRODUCT_SCHEMAS.addProductsToOrder }],
  [
    "getProductsWithStats",
    { func: getProductsWithStats, schema: PRODUCT_SCHEMAS.getProductsWithStats },
  ],
]);

const PATCH_ACTIONS = new Map([
  ["updateProduct", { func: updateProduct, schema: PRODUCT_SCHEMAS.updateProduct }],
  [
    "updateProductVariationInOrder",
    { func: updateProductVariationInOrder, schema: PRODUCT_SCHEMAS.updateProductVariationInOrder },
  ],
  [
    "updateProductInOrder",
    { func: updateProductInOrder, schema: PRODUCT_SCHEMAS.updateProductInOrder },
  ],
  [
    "updateProductOptionsInOrder",
    { func: updateProductOptionsInOrder, schema: PRODUCT_SCHEMAS.updateProductOptionsInOrder },
  ],
  ["toggleProduct", { func: toggleProduct, schema: PRODUCT_SCHEMAS.toggleProduct }],
  [
    "updatePrintedAmounts",
    { func: updatePrintedAmounts, schema: PRODUCT_SCHEMAS.updatePrintedAmounts },
  ],
]);

const GET_ACTIONS = new Map([
  ["getProducts", { func: getProducts, schema: PRODUCT_SCHEMAS.getProducts }],
]);

const DELETE_ACTIONS = new Map([
  [
    "deleteProductsFromOrder",
    { func: removeProductsFromOrder, schema: PRODUCT_SCHEMAS.deleteProductsFromOrder },
  ],
]);

export const PRODUCT_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  GET: GET_ACTIONS,
  DELETE: DELETE_ACTIONS,
};
