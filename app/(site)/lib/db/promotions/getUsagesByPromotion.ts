import { PromotionContracts } from "../../shared";
import { promotionInclude } from "../includes";
import prisma from "../prisma";

export default async function getUsagesByPromotion(
  input: PromotionContracts.GetUsagesByPromotion.Input
): Promise<PromotionContracts.GetUsagesByPromotion.Output> {
  const { promotionId } = input;

  // Fetch the usages by promotion from the database
  const usages = await prisma.promotionUsage.findMany({
    where: { promotion_id: promotionId },
    include: {
      order: true,
      ...promotionInclude
    },
  });

  return usages;
}
