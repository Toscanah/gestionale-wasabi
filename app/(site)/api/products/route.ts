import { NextRequest } from "next/server";
import addProductToOrder from "../../sql/products/addProductToOrder";
import addProductsToOrder from "../../sql/products/addProductsToOrder";
import updateProductInOrder from "../../sql/products/updateProductInOrder";
import deleteProductsFromOrder from "../../sql/products/deleteProductsFromOrder";
import getProducts from "../../sql/products/getProducts";
import updateProduct from "../../sql/products/updateProduct";
import updateProductOptionsInOrder from "../../sql/products/updateProductOptionsInOrder";
import createNewProduct from "../../sql/products/createNewProduct";
import toggleProduct from "../../sql/products/toggleProduct";
import updatePrintedAmounts from "../../sql/products/updatePrintedAmounts";
import { z } from "zod";
import handleRequest from "../util/handleRequest";
import { OrderSchema, ProductSchema } from "@/prisma/generated/zod";
import { NoContentSchema, ProductInOrderWithOptionsSchema } from "../../models";

export const productSchemas = {
  getProducts: NoContentSchema,
  createNewProduct: z.object({
    product: ProductSchema,
  }),
  updateProduct: z.object({
    product: ProductSchema,
  }),
  addProductToOrder: z.object({
    order: OrderSchema,
    productCode: z.string(),
    quantity: z.number(),
  }),
  updateProductInOrder: z.object({
    orderId: z.number(),
    key: z.string(),
    value: z.any(),
    productInOrder: ProductInOrderWithOptionsSchema,
  }),
  addProductsToOrder: z.object({
    targetOrderId: z.number(),
    products: z.array(ProductInOrderWithOptionsSchema),
  }),
  updateProductOptionsInOrder: z.object({
    productInOrderId: z.number(),
    optionId: z.number(),
  }),
  toggleProduct: z.object({
    id: z.number(),
  }),
  updatePrintedAmounts: z.object({
    orderId: z.number(),
  }),
  deleteProductsFromOrder: z.object({
    productIds: z.array(z.number()),
    orderId: z.number(),
    cooked: z.boolean().default(false),
  }),
};

const POST_ACTIONS = new Map([
  ["createNewProduct", { func: createNewProduct, schema: productSchemas.createNewProduct }],
  ["updateProduct", { func: updateProduct, schema: productSchemas.updateProduct }],
  ["addProductToOrder", { func: addProductToOrder, schema: productSchemas.addProductToOrder }],
  [
    "updateProductInOrder",
    { func: updateProductInOrder, schema: productSchemas.updateProductInOrder },
  ],
  ["addProductsToOrder", { func: addProductsToOrder, schema: productSchemas.addProductsToOrder }],
  [
    "updateProductOptionsInOrder",
    { func: updateProductOptionsInOrder, schema: productSchemas.updateProductOptionsInOrder },
  ],
  ["toggleProduct", { func: toggleProduct, schema: productSchemas.toggleProduct }],
  [
    "updatePrintedAmounts",
    { func: updatePrintedAmounts, schema: productSchemas.updatePrintedAmounts },
  ],
  [
    "deleteProductsFromOrder",
    { func: deleteProductsFromOrder, schema: productSchemas.deleteProductsFromOrder },
  ],
]);

const GET_ACTIONS = new Map([
  ["getProducts", { func: getProducts, schema: productSchemas.getProducts }],
]);

const DELETE_ACTIONS = new Map([
  [
    "deleteProductsFromOrder",
    { func: deleteProductsFromOrder, schema: productSchemas.deleteProductsFromOrder },
  ],
]);

export async function POST(request: NextRequest) {
  return await handleRequest(request, "POST", POST_ACTIONS);
}

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

export async function DELETE(request: NextRequest) {
  return await handleRequest(request, "DELETE", DELETE_ACTIONS);
}
