import { ProductWithStats, OptionStats } from "../../shared/types/ProductWithStats";
import prisma from "../db";
import { categoryInclude, optionsInclude } from "../includes";
import TimeScopeFilter from "../../components/filters/shift/TimeScope";
import { GetProductsWithStatsInput } from "../../shared";
import { OrderState, ProductInOrderState } from "@prisma/client";
import orderMatchesShift from "../../lib/order-management/shift/orderMatchesShift";
import { ShiftFilter } from "../../shared/types/ShiftFilter";

export default async function getProductsWithStats({
  filters,
}: GetProductsWithStatsInput): Promise<ProductWithStats[]> {
  const { time, shift, categoryId } = filters;
  const { timeScope, from, to } = time;

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (timeScope == TimeScopeFilter.CUSTOM_RANGE && from && to) {
    const parsedStartDate = new Date(from);
    const parsedEndDate = new Date(to);

    if (!isNaN(parsedStartDate.getTime()) && !isNaN(parsedEndDate.getTime())) {
      parsedStartDate.setHours(0, 0, 0, 0);
      parsedEndDate.setHours(23, 59, 59, 999);

      startDate = new Date(parsedStartDate.getTime() - parsedStartDate.getTimezoneOffset() * 60000);
      endDate = new Date(parsedEndDate.getTime() - parsedEndDate.getTimezoneOffset() * 60000);
    }
  }

  const dateFilter = startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const products = await prisma.product.findMany({
    where: {
      active: true,
      category_id: categoryId ?? undefined,
    },
    include: {
      ...categoryInclude,
      orders: {
        include: {
          product: {
            select: {
              site_price: true,
              home_price: true,
            },
          },
          order: {
            include: {
              home_order: {
                select: {
                  when: true,
                },
              },
              pickup_order: {
                select: {
                  when: true,
                },
              },
            },
          },
          ...optionsInclude,
        },
      },
    },
  });

  const filteredProducts = products
    .map((product) => {
      const filteredOrders = product.orders.filter((productInOrder) => {
        const order = productInOrder.order;

        const isOrderPaid = order.state === OrderState.PAID;
        const isWithinDate =
          !dateFilter || (order.created_at >= dateFilter.gte && order.created_at <= dateFilter.lte);
        const isValidState = productInOrder.state === ProductInOrderState.IN_ORDER;
        const isInShift = orderMatchesShift(order, shift as ShiftFilter);

        return isValidState && isOrderPaid && isWithinDate && isInShift;
      });

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
          productInOrder.state === ProductInOrderState.IN_ORDER &&
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
