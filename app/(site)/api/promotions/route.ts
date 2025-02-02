import { NextRequest } from "next/server";
import { z } from "zod";
import handleRequest from "../util/handleRequest";
import getPromotionsByCustomer from "../../sql/promotions/getPromotionsByCustomer";
import { AddPromotionSchema } from "../../models";
import addPromotion from "../../sql/promotions/addPromotion";

export const promotionsSchemas = {
  getPromotionsByCustomer: z.object({
    customerId: z.number(),
  }),
  deletePromotion: z.object({
    promotionId: z.number(),
  }),
  addPromotion: AddPromotionSchema
};

const POST_ACTIONS = new Map([
  ["addPromotion", { func: addPromotion, schema: promotionsSchemas.addPromotion }],
]);

const GET_ACTIONS = new Map([
  [
    "getPromotionsByCustomer",
    { func: getPromotionsByCustomer, schema: promotionsSchemas.getPromotionsByCustomer },
  ],
]);

// const DELETE_ACTIONS = new Map([
//   ["deletePromotion", { func: deletePromotion, schema: promotionsSchemas.deletePromotion }],
// ]);

// export async function POST(request: NextRequest) {
//   return await handleRequest(request, "POST", POST_ACTIONS);
// }

export async function GET(request: NextRequest) {
  return await handleRequest(request, "GET", GET_ACTIONS);
}

// export async function DELETE(request: NextRequest) {
//   return await handleRequest(request, "DELETE", DELETE_ACTIONS);
// }
