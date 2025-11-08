import { PromotionContracts } from "../../shared";
import prisma from "../prisma";
import { promotionUsagesInclude } from "../includes";

export default async function getPromotionByCode(
  input: PromotionContracts.GetByCode.Input
): Promise<PromotionContracts.GetByCode.Output> {
  const { code } = input;

  return (await prisma.promotion.findFirst({
    where: { code },
    include: {
      ...promotionUsagesInclude,
    },
  })) as PromotionContracts.GetByCode.Output;
}
