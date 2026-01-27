import { OrderByType, PromotionContracts } from "@/lib/shared";
import prisma from "../prisma";
import { getOrderById } from "../orders/getOrderById";
import getPromotionByCode from "./getPromotionByCode";
import { getOrderTotal } from "../../services/order-management/getOrderTotal";
import { PromotionType } from "@/prisma/generated/client/enums";
import { TRPCError } from "@trpc/server";
import rebalancePromotionUsages from "./utils/rebalancePromotionUsages";

export default async function applyPromotionToOrder(
  input: PromotionContracts.ApplyToOrder.Input
): Promise<PromotionContracts.ApplyToOrder.Output> {
  const { orderId, code, amount } = input;

  const order = await getOrderById({ orderId });
  if (!order) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Ordine con ID ${orderId} non trovato.`,
    });
  }

  const promotion = await getPromotionByCode({ code });
  if (!promotion) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Promozione con codice ${code} non trovata.`,
    });
  }

  if (order.promotion_usages.some((pu) => pu.promotion_id === promotion.id)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "La promozione è già stata applicata a questo ordine.",
    });
  }

  const currentTotal = getOrderTotal({ order, applyDiscounts: true, round: true });
  const baseTotal = getOrderTotal({ order, applyDiscounts: false, round: true });

  if (currentTotal <= 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "L'ordine risulta già completamente scontato o pagato.",
    });
  }

  // -----------------------------
  //  TRANSACTION START
  // -----------------------------
  await prisma.$transaction(async (tx) => {
    let usageAmount = 0;

    // ✅ Compute usage amount for the new promo
    switch (promotion.type) {
      case PromotionType.FIXED_DISCOUNT: {
        const discountValue = promotion.fixed_amount ?? 0;
        if (discountValue <= 0)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Importo dello sconto non valido.",
          });
        usageAmount = Math.min(discountValue, baseTotal);
        break;
      }

      case PromotionType.PERCENTAGE_DISCOUNT: {
        const percent = promotion.percentage_value ?? 0;
        if (percent <= 0 || percent > 100)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Percentuale di sconto non valida.",
          });

        if (promotion.max_usages) {
          const count = await tx.promotionUsage.count({
            where: { promotion_id: promotion.id },
          });
          if (count >= promotion.max_usages)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "La promozione ha raggiunto il numero massimo di utilizzi.",
            });
        }

        usageAmount = (currentTotal * percent) / 100;
        break;
      }

      case PromotionType.GIFT_CARD: {
        const totalUsed = await tx.promotionUsage.aggregate({
          _sum: { amount: true },
          where: { promotion_id: promotion.id },
        });
        const remaining = (promotion.fixed_amount ?? 0) - (totalUsed._sum.amount ?? 0);
        if (remaining <= 0)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Saldo della gift card "${promotion.code}" esaurito.`,
          });

        const requested = typeof amount === "number" ? amount : remaining;
        if (requested <= 0)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Importo non valido per la gift card.",
          });

        usageAmount = Math.min(requested, remaining, currentTotal);
        break;
      }

      default:
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Tipo di promozione non riconosciuto.",
        });
    }

    // ✅ Create the new usage
    await tx.promotionUsage.create({
      data: {
        order_id: orderId,
        promotion_id: promotion.id,
        amount: Number(usageAmount.toFixed(2)),
      },
    });

    // ✅ Fetch all promotions again (including the new one)
    const freshOrder = await getOrderById({ orderId });
    if (!freshOrder) throw new Error("Ordine non trovato dopo l'inserimento.");

    await rebalancePromotionUsages(tx, freshOrder);
  });

  return await getOrderById({
    orderId: order.id,
  });
}
