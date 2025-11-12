import prisma from "../prisma";
import { PaymentContracts } from "../../shared";
import { OrderType, PaymentType, PromotionType } from "@prisma/client";
import calculatePaymentsSummary from "../../services/payments/calculatePaymentsSummary";
import { productsInOrderInclude } from "../includes";
import buildOrderWhere from "../orders/util/buildOrderWhere";
import { getOrderTotal } from "../../services/order-management/getOrderTotal";

export default async function getPaymentsSummary(
  input: PaymentContracts.GetSummary.Input
): Promise<PaymentContracts.GetSummary.Output> {
  const { filters } = input ?? {};
  const where = buildOrderWhere(filters);

  // 🔹 Prisma aggregations
  const [paymentsByType, ordersByType, tablePeopleSum, filteredOrders, promotionsByType] =
    await Promise.all([
      prisma.payment.groupBy({
        by: ["type"],
        _sum: { amount: true },
        where: { order: where },
      }),
      prisma.order.groupBy({
        by: ["type"],
        _count: { _all: true },
        where,
      }),
      prisma.tableOrder.aggregate({
        _sum: { people: true },
        where: { order: { ...where, type: "TABLE" } },
      }),
      prisma.order.findMany({
        where,
        include: {
          payments: true,
          table_order: true,
          ...productsInOrderInclude,
        },
      }),
      prisma.promotionUsage.groupBy({
        by: ["promotion_id"],
        _sum: { amount: true },
        where: {
          order: where,
        },
      }),
    ]);

  // --- Build payment totals ---
  const totals: PaymentContracts.GetSummary.Output["totals"] = {
    [PaymentType.CASH]: { label: "Contanti", total: 0 },
    [PaymentType.CARD]: { label: "Carta", total: 0 },
    [PaymentType.VOUCH]: { label: "Buoni", total: 0 },
    [PaymentType.CREDIT]: { label: "Crediti", total: 0 },
    [PaymentType.PROMOTION]: { label: "Promozioni", total: 0 },
  };
  paymentsByType.forEach((p) => {
    totals[p.type].total = p._sum.amount ?? 0;
  });

  // --- Count orders by type ---
  const countsMap: Record<OrderType, number> = {
    TABLE: 0,
    HOME: 0,
    PICKUP: 0,
  };
  ordersByType.forEach((o) => {
    countsMap[o.type as OrderType] = o._count._all;
  });

  const tableOrdersCount = countsMap.TABLE ?? 0;
  const homeOrdersCount = countsMap.HOME ?? 0;
  const pickupOrdersCount = countsMap.PICKUP ?? 0;

  // --- Estimate customers count ---
  let customersCount = tablePeopleSum._sum.people ?? 0;
  customersCount += homeOrdersCount + pickupOrdersCount;

  // --- 🧮 Calculate total manual discounts in euros ---
  let manualDiscountTotal = 0;
  for (const order of filteredOrders) {
    if (order.discount && order.discount > 0) {
      const orderTotal = getOrderTotal({ order });
      manualDiscountTotal += (orderTotal * order.discount) / 100;
    }
  }

  // --- 🎟️ Promotions (group by promotion type) ---
  const promotionIds = promotionsByType.map((p) => p.promotion_id);
  const promotionTypes =
    promotionIds.length > 0
      ? await prisma.promotion.findMany({
          where: { id: { in: promotionIds } },
          select: { id: true, type: true },
        })
      : [];

  const promotionTypeMap = Object.fromEntries(promotionTypes.map((p) => [p.id, p.type]));

  const promoTotals: Record<PromotionType, number> = {
    [PromotionType.FIXED_DISCOUNT]: 0,
    [PromotionType.PERCENTAGE_DISCOUNT]: 0,
    [PromotionType.GIFT_CARD]: 0,
  };

  promotionsByType.forEach((p) => {
    const type = promotionTypeMap[p.promotion_id];
    if (type) {
      promoTotals[type] += p._sum.amount ?? 0;
    }
  });

  // --- Calculate order totals (reuse your existing service) ---
  const {
    rawTotalAmount,
    totalAmount,
    centsDifference,
    inPlaceAmount,
    takeawayAmount,
    homeOrdersAmount,
    pickupOrdersAmount,
    tableOrdersAmount,
  } = calculatePaymentsSummary(filteredOrders);

  console.log(rawTotalAmount, totalAmount, centsDifference);

  // --- Return final summary ---
  return {
    totals,
    inPlaceAmount,
    takeawayAmount,
    homeOrdersAmount,
    pickupOrdersAmount,
    tableOrdersAmount,
    customersCount,
    homeOrdersCount,
    pickupOrdersCount,
    tableOrdersCount,
    totalAmount,
    rawTotalAmount,
    centsDifference,
    discountsAndPromotions: {
      manual: manualDiscountTotal,
      fixed_promotions: promoTotals.FIXED_DISCOUNT,
      percentage_promotions: promoTotals.PERCENTAGE_DISCOUNT,
      gift_cards: promoTotals.GIFT_CARD,
    },
  };
}
