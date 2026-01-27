import {
  OrderByType,
  OrderByTypeSchema,
  PromotionByType,
  PromotionByTypeSchema,
  PromotionContracts,
} from "@/lib/shared";
import { promotionInclude } from "../includes";
import { getOrderById } from "../orders/getOrderById";
import prisma from "../prisma";

export default async function getUsagesByPromotion(
  input: PromotionContracts.GetUsagesByPromotion.Input
): Promise<PromotionContracts.GetUsagesByPromotion.Output> {
  const { promotionId } = input;

  const usages = await prisma.promotionUsage.findMany({
    where: { promotion_id: promotionId },
    include: {
      ...promotionInclude,
    },
    orderBy: { created_at: "asc" },
  });

  const usagesWithOrders = await Promise.all(
    usages.map(async (usage) => ({
      ...usage,
      promotion: usage.promotion as PromotionByType,
      order: (await getOrderById({ orderId: usage.order_id })) as OrderByType,
    }))
  );

  return usagesWithOrders;
}
