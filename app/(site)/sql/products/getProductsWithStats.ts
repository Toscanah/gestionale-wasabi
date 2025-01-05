import { ProductWithStats } from "../../types/ProductWithStats";
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
      
      startDate = parsedStartDate;
      endDate = parsedEndDate;
    }
  }

  console.log(startDate, endDate);

  const dateFilter = startDate && endDate ? { gte: startDate, lte: endDate } : undefined;

  const productsWithStats = await prisma.product.findMany({
    where: {
      active: true,
      orders: {
        some: {
          order: {
            state: { not: "CANCELLED" },
            created_at: dateFilter,
          },
        },
      },
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
        },
      },
    },
  });

  return productsWithStats.map((product) => {
    const stats = product.orders.reduce(
      (acc, productInOrder) => {
        acc.quantity += productInOrder.quantity;
        acc.total += productInOrder.total;
        return acc;
      },
      { quantity: 0, total: 0 }
    );

    const { orders, ...productWithoutOrders } = product;

    return {
      ...productWithoutOrders,
      quantity: stats.quantity,
      total: stats.total,
    };
  });
}
