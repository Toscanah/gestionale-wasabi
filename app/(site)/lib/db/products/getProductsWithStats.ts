import { ProductWithStats, OptionStats } from "../../shared/types/product-with-stats";
import prisma from "../db";
import { categoryInclude, optionsInclude } from "../includes";
import { OrderStatus, ProductInOrderStatus } from "@prisma/client";
import orderMatchesShift from "../../services/order-management/shift/orderMatchesShift";
import { ProductContract, ShiftFilterValue } from "../../shared";
import { endOfDay, startOfDay } from "date-fns";
import normalizePeriod from "../../utils/global/date/normalizePeriod";

export default async function getProductsWithStats({
  filters,
}: ProductContract["Requests"]["GetProductsWithStats"]): Promise<ProductWithStats[]> {
  const { categoryIds, period, shift } = filters;

  let dateFilter: { gte?: Date; lte?: Date } | undefined;
  const normalizedPeriod = normalizePeriod(period);

  if (normalizedPeriod && normalizedPeriod.from) {
    if (normalizedPeriod.to) {
      dateFilter = {
        gte: startOfDay(new Date(normalizedPeriod.from)),
        lte: endOfDay(new Date(normalizedPeriod.to)),
      };
    } else {
      dateFilter = { gte: startOfDay(new Date(normalizedPeriod.from)) };
    }
  } else {
    dateFilter = undefined; // no restrictions
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(categoryIds && categoryIds.length > 0 ? { category_id: { in: categoryIds } } : {}),
    },
    include: {
      ...categoryInclude,
      orders: {
        where: {
          status: ProductInOrderStatus.IN_ORDER,
          order: {
            status: OrderStatus.PAID,
            ...(dateFilter
              ? {
                  created_at: {
                    ...(dateFilter.gte ? { gte: dateFilter.gte } : {}),
                    ...(dateFilter.lte ? { lte: dateFilter.lte } : {}),
                  },
                }
              : {}),
          },
        },
        include: {
          product: {
            select: {
              site_price: true,
              home_price: true,
            },
          },
          order: {
            include: {
              home_order: { select: { when: true } },
              pickup_order: { select: { when: true } },
            },
          },
          ...optionsInclude,
        },
      },
    },
  });

  const filteredProducts = products
    .map((product) => {
      const filteredOrders = product.orders.filter((productInOrder) =>
        orderMatchesShift(productInOrder.order, shift as ShiftFilterValue)
      );

      if (filteredOrders.length > 0) {
        return { ...product, orders: filteredOrders };
      }
      return null;
    })
    .filter(Boolean) as typeof products;

  return filteredProducts.map((product) => {
    const stats = product.orders.reduce(
      (acc, productInOrder) => {
        if (
          productInOrder.status === ProductInOrderStatus.IN_ORDER &&
          productInOrder.paid_quantity > 0
        ) {
          const paidQty = Math.min(productInOrder.paid_quantity, productInOrder.quantity);

          acc.quantity += paidQty;
          acc.total += (productInOrder.frozen_price ?? 0) * paidQty;

          productInOrder.options.forEach((optionInOrder) => {
            const optionName = optionInOrder.option.option_name;
            acc.options[optionName] = (acc.options[optionName] || 0) + paidQty;
          });
        }

        return acc;
      },
      { quantity: 0, total: 0, options: {} as Record<string, number> }
    );

    const optionsRank: OptionStats[] = Object.entries(stats.options)
      .map(([optionName, count], index) => ({
        option: optionName,
        count,
        position: index + 1,
      }))
      .sort((a, b) => b.count - a.count);

    const { orders, ...productWithoutOrders } = product;

    return {
      ...productWithoutOrders,
      quantity: stats.quantity,
      total: stats.total,
      optionsRank,
    };
  });
}
