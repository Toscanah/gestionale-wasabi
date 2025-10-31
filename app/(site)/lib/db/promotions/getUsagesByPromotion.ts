import { PromotionContracts } from "../../shared";
import prisma from "../db";

export default async function getUsagesByPromotion(
  input: PromotionContracts.GetUsagesByPromotion.Input
): Promise<PromotionContracts.GetUsagesByPromotion.Output> {
  const { promotionId } = input;

  // Fetch the usages by promotion from the database
  const usages = await prisma.promotionUsage.findMany({
    where: { promotion_id: promotionId },
    include: { order: true },
  });

  return usages;
}
