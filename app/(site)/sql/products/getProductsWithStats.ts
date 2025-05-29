import { ProductWithStats, OptionStats } from "../../shared/types/ProductWithStats";
import prisma from "../db";
import { categoryInclude, optionsInclude } from "../includes";
import TimeScopeFilter from "../../components/filters/shift/TimeScope";
import { orderMatchesShift } from "../../lib/order-management/shift/orderMatchesShift";
import { GetProductsWithStatsInput } from "../../shared";
import { ShiftFilter } from "../../components/filters/shift/ShiftFilterSelector";

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
        const withinDate =
          !dateFilter || (order.created_at >= dateFilter.gte && order.created_at <= dateFilter.lte);

        return withinDate && orderMatchesShift(order, shift as ShiftFilter);
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
        acc.quantity += productInOrder.quantity;
        acc.total += productInOrder.total;

        productInOrder.options.forEach((optionInOrder) => {
          const optionName = optionInOrder.option.option_name;
          acc.options[optionName] = (acc.options[optionName] || 0) + productInOrder.quantity;
        });

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
