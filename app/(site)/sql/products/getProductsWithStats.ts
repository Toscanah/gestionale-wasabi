import { ProductWithStats, OptionStats } from "../../types/ProductWithStats";
import prisma from "../db";

export enum TimeFilter {
  CUSTOM = "custom",
  ALL = "all",
}

export default async function getProductsWithStats(
  timeFilter: TimeFilter,
  from?: Date,
  to?: Date
): Promise<ProductWithStats[]> {
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  if (timeFilter === TimeFilter.ALL) {
    startDate = undefined;
    endDate = undefined;
  } else if (from && to) {
    const parsedStartDate = new Date(from);
    const parsedEndDate = new Date(to);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      startDate = undefined;
      endDate = undefined;
    } else {
      parsedStartDate.setHours(0, 0, 0, 0);
      parsedEndDate.setHours(23, 59, 59, 999);

      startDate = new Date(parsedStartDate.getTime() - parsedStartDate.getTimezoneOffset() * 60000);
      endDate = new Date(parsedEndDate.getTime() - parsedEndDate.getTimezoneOffset() * 60000);
    }
  }

  const dateFilter = startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const productsWithStats = await prisma.product.findMany({
    where: {
      active: true,
    },
    include: {
      category: {
        include: {
          options: {
            include: {
              option: true,
            },
          },
        },
      },
      orders: {
        include: {
          order: true,
          options: {
            include: {
              option: true,
            },
          },
        },
      },
    },
  });

  const filteredProducts = productsWithStats
    .map((product) => {
      const filteredOrders = product.orders.filter((productInOrder) => {
        const order = productInOrder.order;

        if (!dateFilter) {
          return true;
        }

        return order.created_at >= dateFilter.gte && order.created_at <= dateFilter.lte;
      });

      if (filteredOrders.length > 0) {
        return { ...product, orders: filteredOrders };
      }

      return null;
    })
    .filter(Boolean) as typeof productsWithStats;

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

    // Convert options object to sorted array
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
