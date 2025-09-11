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
import updatePrintedProducts from "../../lib/db/products/updatePrintedProducts";
import updateProductVariationInOrder from "../../lib/db/products/updateProductVariationInOrder";
import getProductsWithStats from "../../lib/db/products/getProductsWithStats";
import { PRODUCT_REQUESTS } from "../../lib/shared/schemas/product";

const POST_ACTIONS = new Map([
  ["createNewProduct", { func: createNewProduct, schema: PRODUCT_REQUESTS.createNewProduct }],
  ["addProductToOrder", { func: addProductToOrder, schema: PRODUCT_REQUESTS.addProductToOrder }],
  ["addProductsToOrder", { func: addProductsToOrder, schema: PRODUCT_REQUESTS.addProductsToOrder }],
  [
    "getProductsWithStats",
    { func: getProductsWithStats, schema: PRODUCT_REQUESTS.getProductsWithStats },
  ],
]);

const PATCH_ACTIONS = new Map([
  ["updateProduct", { func: updateProduct, schema: PRODUCT_REQUESTS.updateProduct }],
  [
    "updateProductVariationInOrder",
    { func: updateProductVariationInOrder, schema: PRODUCT_REQUESTS.updateProductVariationInOrder },
  ],
  [
    "updateProductInOrder",
    { func: updateProductInOrder, schema: PRODUCT_REQUESTS.updateProductInOrder },
  ],
  [
    "updateProductOptionsInOrder",
    { func: updateProductOptionsInOrder, schema: PRODUCT_REQUESTS.updateProductOptionsInOrder },
  ],
  ["toggleProduct", { func: toggleProduct, schema: PRODUCT_REQUESTS.toggleProduct }],
  [
    "updatePrintedProducts",
    { func: updatePrintedProducts, schema: PRODUCT_REQUESTS.updatePrintedProducts },
  ],
]);

const GET_ACTIONS = new Map([
  ["getProducts", { func: getProducts, schema: PRODUCT_REQUESTS.getProducts }],
]);

const DELETE_ACTIONS = new Map([
  [
    "deleteProductsFromOrder",
    { func: removeProductsFromOrder, schema: PRODUCT_REQUESTS.deleteProductsFromOrder },
  ],
]);

export const PRODUCT_ACTIONS: ActionsMapRecord = {
  POST: POST_ACTIONS,
  PATCH: PATCH_ACTIONS,
  GET: GET_ACTIONS,
  DELETE: DELETE_ACTIONS,
};
