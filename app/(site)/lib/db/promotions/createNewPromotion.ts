import { PromotionType } from "@/prisma/generated/client/enums";
import { PromotionContracts } from "../../shared";
import prisma from "../prisma";
import { endOfDay } from "date-fns";

export default async function createNewPromotion(
  input: PromotionContracts.Create.Input
): Promise<PromotionContracts.Create.Output> {
  const { promotion } = input;

  const newPromotion = await prisma.promotion.create({
    data: {
      code: promotion.code,
      type: promotion.type,
      label: promotion.label,
      expires_at: promotion.expires_at ? endOfDay(promotion.expires_at) : null,
      never_expires: promotion.never_expires,
      fixed_amount:
        promotion.type === PromotionType.FIXED_DISCOUNT ||
        promotion.type === PromotionType.GIFT_CARD
          ? promotion.fixed_amount
          : null,
      percentage_value:
        promotion.type === PromotionType.PERCENTAGE_DISCOUNT ? promotion.percentage_value : null,
      reusable: promotion.reusable,
      max_usages:
        promotion.type === PromotionType.PERCENTAGE_DISCOUNT
          ? (promotion.max_usages ?? null)
          : null,
    },
    include: {
      usages: true,
    },
  });

  return newPromotion as PromotionContracts.Create.Output;
}
