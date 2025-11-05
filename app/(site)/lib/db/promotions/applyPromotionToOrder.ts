import { OrderByType, PromotionContracts } from "../../shared";
import prisma from "../db";
import { getOrderById } from "../orders/getOrderById";
import getPromotionByCode from "./getPromotionByCode";
import { getOrderTotal } from "../../services/order-management/getOrderTotal";
import { PromotionType } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export default async function applyPromotionToOrder(
  input: PromotionContracts.ApplyToOrder.Input
): Promise<PromotionContracts.ApplyToOrder.Output> {
  const { orderId, code, amount } = input;

  const order = await getOrderById({ orderId });

  if (!order) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Ordine con ID ${orderId} non trovato`,
    });
  }

  const promotion = await getPromotionByCode({ code });

  if (!promotion) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Promozione con codice ${code} non trovata`,
    });
  }

  if (order.promotion_usages.some((pu) => pu.promotion_id === promotion.id)) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "La promozione è già stata applicata a questo ordine",
    });
  }

  const currentTotal = getOrderTotal({
    order,
    applyDiscounts: true,
    round: true,
  });

  let usageAmount = 0;

  switch (promotion.type) {
    case PromotionType.FIXED_DISCOUNT: {
      const discountValue = promotion.fixed_amount ?? 0;
      if (discountValue <= 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Importo dello sconto non valido",
        });

      usageAmount = Math.min(discountValue, currentTotal);
      break;
    }

    case PromotionType.GIFT_CARD: {
      const totalUsed = await prisma.promotionUsage.aggregate({
        _sum: { amount: true },
        where: { promotion_id: promotion.id },
      });

      const remaining = (promotion.fixed_amount ?? 0) - (totalUsed._sum.amount ?? 0);

      if (remaining <= 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Saldo della gift card esaurito",
        });

      // ✅ Use user-specified amount if provided, else default to remaining
      const requestedAmount = typeof amount === "number" ? amount : remaining;

      if (requestedAmount <= 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Importo non valido per la gift card",
        });

      // ✅ Clamp to remaining and current total (safety)
      usageAmount = Math.min(requestedAmount, remaining, currentTotal);
      break;
    }

    case PromotionType.PERCENTAGE_DISCOUNT: {
      const percent = promotion.percentage_value ?? 0;
      if (percent <= 0 || percent > 100)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Percentuale di sconto non valida",
        });

      if (promotion.max_usages) {
        const existingUsages = await prisma.promotionUsage.count({
          where: { promotion_id: promotion.id },
        });
        if (existingUsages >= promotion.max_usages) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "La promozione ha raggiunto il numero massimo di utilizzi",
          });
        }
      }

      usageAmount = (currentTotal * percent) / 100;
      break;
    }

    default:
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Tipo di promozione non riconosciuto",
      });
  }

  const simulatedOrder: OrderByType = {
    ...order,
    products: order.products,
    discount: order.discount,
    promotion_usages: [
      ...(order.promotion_usages ?? []),
      {
        promotion_id: promotion.id,
        promotion,
        amount: usageAmount,
        created_at: new Date(),
        id: -1,
        order_id: order.id,
      },
    ],
  };

  const simulatedTotal = getOrderTotal({
    order: simulatedOrder,
    applyDiscounts: true,
  });

  if (simulatedTotal < 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "L'applicazione di questa promozione porterebbe il totale dell'ordine sotto zero",
    });
  }

  await prisma.promotionUsage.create({
    data: {
      order_id: orderId,
      promotion_id: promotion.id,
      amount: usageAmount,
    },
    include: { promotion: true },
  });

  return await getOrderById({ orderId });
}
