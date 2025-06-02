import { NextRequest } from "next/server";
import addProductToOrder from "../../sql/products/addProductToOrder";
import addProductsToOrder from "../../sql/products/addProductsToOrder";
import updateProductInOrder from "../../sql/products/product-in-order/updateProductInOrder";
import removeProductsFromOrder from "../../sql/products/removeProductsFromOrder";
import getProducts from "../../sql/products/getProducts";
import updateProduct from "../../sql/products/updateProduct";
import updateProductOptionsInOrder from "../../sql/products/updateProductOptionsInOrder";
import createNewProduct from "../../sql/products/createNewProduct";
import toggleProduct from "../../sql/products/toggleProduct";
import updatePrintedAmounts from "../../sql/products/updatePrintedAmounts";
import handleRequest from "../util/handleRequest";
import updateAdditionalNote from "../../sql/customers/updateAdditionalNote";
import getProductsWithStats from "../../sql/products/getProductsWithStats";
import { PRODUCT_SCHEMAS } from "../../shared/schemas/product";

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
