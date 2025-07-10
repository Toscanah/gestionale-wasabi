import { NextRequest } from "next/server";
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
import handleRequest from "../../lib/api/handleRequest";
import updateAdditionalNote from "../../lib/db/customers/updateAdditionalNote";
import getProductsWithStats from "../../lib/db/products/getProductsWithStats";
import { PRODUCT_SCHEMAS } from "../../lib/shared/schemas/product";

const POST_ACTIONS = new Map([
  ["createNewProduct", { func: createNewProduct, schema: PRODUCT_SCHEMAS.createNewProduct }],
  ["addProductToOrder", { func: addProductToOrder, schema: PRODUCT_SCHEMAS.addProductToOrder }],
  ["addProductsToOrder", { func: addProductsToOrder, schema: PRODUCT_SCHEMAS.addProductsToOrder }],
  ["getProductsWithStats", { func: getProductsWithStats, schema: PRODUCT_SCHEMAS.getProductsWithStats }],
]);

const PATCH_ACTIONS = new Map([
  ["updateProduct", { func: updateProduct, schema: PRODUCT_SCHEMAS.updateProduct }],
  [
    "updateAdditionalNote",
    { func: updateAdditionalNote, schema: PRODUCT_SCHEMAS.updateAdditionalNote },
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

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function PATCH(request: NextRequest) {
  return await handleRequest(request, "PATCH", PATCH_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}
