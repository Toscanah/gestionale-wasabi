import getDiscountedTotal from "./getDiscountedTotal";
import roundToTwo from "../../utils/global/number/roundToTwo";
import filterDeletedProducts from "../../services/product-management/filterDeletedProducts";
import { LiteOrder, PromotionUsageWithPromotion } from "../../shared";
import { PromotionType } from "@prisma/client";

type BaseOrderInput = Pick<LiteOrder, "products" | "type">;

type OrderInput = BaseOrderInput & {
  discount?: number;
  promotion_usages?: PromotionUsageWithPromotion[];
};

export function getOrderTotal({
  order,
  applyDiscounts = false,
  round = false,
  onlyPaid = false,
}: {
  order: OrderInput;
  applyDiscounts?: boolean;
  round?: boolean;
  onlyPaid?: boolean;
}): number {
  const { products } = order;

  // 1️⃣ Base subtotal (respecting paid_quantity if needed)
  const subtotal = filterDeletedProducts(products).reduce(
    (acc, product) =>
      acc + (onlyPaid ? product.paid_quantity : product.quantity) * product.frozen_price,
    0
  );

  let total = subtotal;

  // 2️⃣ Apply all discounts/promotions if requested
  if (applyDiscounts) {
    // --- Manual discount ---
    if (order.discount && order.discount > 0) {
      const cappedDiscount = Math.min(order.discount, 100);
      total = getDiscountedTotal({
        orderTotal: total,
        discountPercentage: cappedDiscount,
      });
    }

    // --- Promotions ---
    if (order.promotion_usages?.length) {
      const percentPromos = order.promotion_usages.filter(
        (u) => u.promotion.type === PromotionType.PERCENTAGE_DISCOUNT
      );
      const fixedPromos = order.promotion_usages.filter(
        (u) =>
          u.promotion.type === PromotionType.FIXED_DISCOUNT ||
          u.promotion.type === PromotionType.GIFT_CARD
      );

      // Combine all % promos — cap at 100%
      const totalPercent = Math.min(
        percentPromos.reduce((acc, u) => acc + (u.promotion.percentage_value ?? 0), 0),
        100
      );

      if (totalPercent > 0) {
        total = getDiscountedTotal({
          orderTotal: total,
          discountPercentage: totalPercent,
        });
      }

      // Apply fixed/gift-card amounts
      for (const u of fixedPromos) {
        const amount = u.amount ?? u.promotion.fixed_amount ?? 0;
        total -= Math.min(amount, total); // never below 0
      }
    }
  }

  // 3️⃣ Clamp to prevent negatives
  total = Math.max(total, 0);

  // 4️⃣ Round if requested
  return round ? parseFloat(roundToTwo(total)) : total;
}
