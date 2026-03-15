import { Prisma } from "@/prisma/generated/client/client";
import { PromotionType } from "@/prisma/generated/client/enums";
import { getOrderTotal } from "../../../services/order-management/getOrderTotal";
import { OrderByType } from "@/lib/shared";

/**
 * Rebalances all promotion usages on an order.
 * - Clamps each usage downwards if the order total or balance decreased.
 * - Never increases any promotion usage automatically (fair for gift cards, etc.).
 */
export default async function rebalancePromotionUsages(
  tx: Prisma.TransactionClient,
  order: OrderByType
) {
  const usages = order.promotion_usages ?? [];
  if (usages.length === 0) return [];

  const totalBeforeDiscounts = getOrderTotal({
    order,
    applyDiscounts: false,
    round: true,
  });

  // Start from base total
  let remaining = totalBeforeDiscounts;
  const updates: { id: number; newAmount: number; shouldUpdate: boolean }[] = [];

  // 1️⃣ Manual discount
  if (order.discount && order.discount > 0) {
    const manual = (remaining * order.discount) / 100;
    remaining -= manual;
  }

  // 2️⃣ Percentage promos first
  for (const u of usages.filter((u) => u.promotion.type === PromotionType.PERCENTAGE_DISCOUNT)) {
    const percent = u.promotion.percentage_value ?? 0;
    const computed = Math.min((remaining * percent) / 100, remaining);

    // ⬇️ Only allow downward adjustments
    const newAmount = Math.min(u.amount, computed);

    remaining -= newAmount;
    updates.push({
      id: u.id,
      newAmount: Number(newAmount.toFixed(2)),
      shouldUpdate: Math.abs(newAmount - u.amount) > 0.009,
    });
  }

  // 3️⃣ Fixed promos next
  for (const u of usages.filter((u) => u.promotion.type === PromotionType.FIXED_DISCOUNT)) {
    const fixed = u.promotion.fixed_amount ?? 0;
    const computed = Math.min(fixed, remaining);

    // ⬇️ Only allow downward adjustments
    const newAmount = Math.min(u.amount, computed);

    remaining -= newAmount;
    updates.push({
      id: u.id,
      newAmount: Number(newAmount.toFixed(2)),
      shouldUpdate: Math.abs(newAmount - u.amount) > 0.009,
    });
  }

  // 4️⃣ Gift cards last (special handling)
  for (const u of usages.filter((u) => u.promotion.type === PromotionType.GIFT_CARD)) {
    const totalUsed =
      u.promotion.usages
        ?.filter((x) => x.id !== u.id)
        ?.reduce((sum, x) => sum + (x.amount ?? 0), 0) ?? 0;

    const remainingCardBalance = Math.max(0, (u.promotion.fixed_amount ?? 0) - totalUsed);
    const computed = Math.min(remaining, remainingCardBalance);

    // ⬇️ Only allow downward adjustment (no auto-increase)
    const newAmount = Math.min(u.amount, computed);

    remaining -= newAmount;
    updates.push({
      id: u.id,
      newAmount: Number(newAmount.toFixed(2)),
      shouldUpdate: Math.abs(newAmount - u.amount) > 0.009,
    });
  }

  // 5️⃣ Persist updates
  for (const usage of updates) {
    if (usage.shouldUpdate) {
      await tx.promotionUsage.update({
        where: { id: usage.id },
        data: { amount: usage.newAmount },
      });
    }
  }

  return updates.filter((u) => u.shouldUpdate);
}
