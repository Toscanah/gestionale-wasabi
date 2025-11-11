import { PromotionContracts } from "../../shared";
import { getOrderById } from "../orders/getOrderById";
import prisma from "../prisma";
import rebalancePromotionUsages from "./utils/rebalancePromotionUsages";

export async function rebalanceOrderPromotions({
  orderId,
}: PromotionContracts.RebalanceOrderPromotions.Input): Promise<PromotionContracts.RebalanceOrderPromotions.Output> {
  const order = await getOrderById({ orderId });
  if (!order) throw new Error("Order not found");

  await rebalancePromotionUsages(prisma, order);
  
  return getOrderById({ orderId });
}
