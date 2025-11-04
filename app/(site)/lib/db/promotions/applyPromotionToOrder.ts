import { OrderByType, PromotionContracts } from "../../shared";
import prisma from "../db";
import { getOrderById } from "../orders/getOrderById";
import getPromotionByCode from "./getPromotionByCode";
import { getOrderTotal } from "../../services/order-management/getOrderTotal";
import { PromotionType } from "@prisma/client";

export default async function applyPromotionToOrder(
  input: PromotionContracts.ApplyPromotion.Input
): Promise<PromotionContracts.ApplyPromotion.Output> {
  const { orderId, code } = input;

  const order = await getOrderById({ orderId });

  if (!order) {
    throw new Error("Ordine con ID " + orderId + " non trovato");
  }

  const promotion = await getPromotionByCode({ code });

  if (!promotion) {
    throw new Error("Promozione con codice " + code + " non trovata");
  }

  if (order.promotion_usages.some((pu) => pu.promotion_id === promotion.id)) {
    throw new Error("La promozione è già stata applicata a questo ordine");
  }

  // Current total before applying promo
  const currentTotal = getOrderTotal({
    order,
    applyDiscounts: true,
    round: true,
  });

  let usageAmount = 0;

  // --- Type-specific logic ---
  switch (promotion.type) {
    case PromotionType.FIXED_DISCOUNT: {
      const discountValue = promotion.fixed_amount ?? 0;
      if (discountValue <= 0) throw new Error("Importo dello sconto non valido");

      // Use at most the current total (prevent negative)
      usageAmount = Math.min(discountValue, currentTotal);
      break;
    }

    case PromotionType.GIFT_CARD: {
      const totalUsed = await prisma.promotionUsage.aggregate({
        _sum: { amount: true },
        where: { promotion_id: promotion.id },
      });

      const remaining = (promotion.fixed_amount ?? 0) - (totalUsed._sum.amount ?? 0);
      if (remaining <= 0) throw new Error("Saldo della gift card esaurito");

      // Use at most remaining balance or current total
      usageAmount = Math.min(remaining, currentTotal);
      break;
    }

    case PromotionType.PERCENTAGE_DISCOUNT: {
      const percent = promotion.percentage_value ?? 0;
      if (percent <= 0 || percent > 100) throw new Error("Percentuale di sconto non valida");

      // Check for max usages
      if (promotion.max_usages) {
        const existingUsages = await prisma.promotionUsage.count({
          where: { promotion_id: promotion.id },
        });
        if (existingUsages >= promotion.max_usages) {
          throw new Error("La promozione ha raggiunto il numero massimo di utilizzi");
        }
      }

      // Calculate how much € is discounted
      usageAmount = (currentTotal * percent) / 100;
      break;
    }

    default:
      throw new Error("Tipo di promozione non riconosciuto");
  }

  // --- Simulate application ---
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

  // --- Validate total ---
  if (simulatedTotal < 0) {
    throw new Error(
      "L'applicazione di questa promozione porterebbe il totale dell'ordine sotto zero"
    );
  }

  // --- Create promotion usage ---
  const usage = await prisma.promotionUsage.create({
    data: {
      order_id: orderId,
      promotion_id: promotion.id,
      amount: usageAmount,
    },
    include: { promotion: true },
  });

  return usage;
}
