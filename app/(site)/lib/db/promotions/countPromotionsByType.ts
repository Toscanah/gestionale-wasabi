import { PromotionType } from "@prisma/client";
import { PromotionContracts } from "../../shared";
import prisma from "../db";

export default async function countPromotionsByType(
  input: PromotionContracts.CountsByType.Input
): Promise<PromotionContracts.CountsByType.Output> {
  const result = await prisma.promotion.groupBy({
    by: ["type"],
    _count: { _all: true },
  });

  return {
    [PromotionType.FIXED_DISCOUNT]:
      result.find((r) => r.type === PromotionType.FIXED_DISCOUNT)?._count._all ?? 0,
    [PromotionType.PERCENTAGE_DISCOUNT]:
      result.find((r) => r.type === PromotionType.PERCENTAGE_DISCOUNT)?._count._all ?? 0,
    [PromotionType.GIFT_CARD]:
      result.find((r) => r.type === PromotionType.GIFT_CARD)?._count._all ?? 0,
  };
}
