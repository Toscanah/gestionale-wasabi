import { Order } from "@prisma/client";
import { CustomerWithStats } from "../../types/CustomerWithStats";
import prisma from "../db";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";

const calculateAverageOrders = (allOrders: Order[]) => {
  if (allOrders.length === 0) {
    return { averageWeek: 0, averageMonth: 0, averageYear: 0 };
  }

  const now = new Date();
  const firstOrderDate = allOrders.reduce((earliest, order) => {
    const date = order?.created_at || new Date();
    return date < earliest ? date : earliest;
  }, now);

  const totalDays = (now.getTime() - firstOrderDate.getTime()) / (1000 * 60 * 60 * 24);
  const totalWeeks = totalDays / 7;
  const totalMonths = totalDays / 30.44;
  const totalYears = totalDays / 365;

  const totalOrders = allOrders.length;

  const averageOrdersWeek = totalWeeks >= 1 ? totalOrders / totalWeeks : totalOrders;
  const averageOrdersMonth = totalMonths >= 1 ? totalOrders / totalMonths : totalOrders;
  const averageOrdersYear = totalYears >= 1 ? totalOrders / totalYears : totalOrders;

  return { averageOrdersWeek, averageOrdersMonth, averageOrdersYear };
};

export default async function getCustomersWithStats(
  from: Date | undefined,
  to: Date | undefined
): Promise<CustomerWithStats[]> {
  const customers = await prisma.customer.findMany({
    where: {
      active: true,
    },
    include: {
      addresses: true,
      phone: true,
      home_orders: {
        include: {
          order: {
            include: {
              products: {
                include: {
                  product: {
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
                    },
                  },
                  options: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      pickup_orders: {
        include: {
          order: {
            include: {
              products: {
                include: {
                  product: {
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
                    },
                  },
                  options: {
                    include: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const customersWithStats = customers.map((customer) => {
    let allOrders = [
      ...customer.home_orders.map((homeOrder) => homeOrder.order),
      ...customer.pickup_orders.map((pickupOrder) => pickupOrder.order),
    ];

    if (from && to) {
      const parsedStartDate = new Date(from);
      const parsedEndDate = new Date(to);

      parsedStartDate.setHours(0, 0, 0, 0);
      parsedEndDate.setHours(23, 59, 59, 999);

      const startDate = new Date(
        parsedStartDate.getTime() - parsedStartDate.getTimezoneOffset() * 60000
      );
      const endDate = new Date(parsedEndDate.getTime() - parsedEndDate.getTimezoneOffset() * 60000);

      allOrders = allOrders.filter((order) => {
        const createdAt = order.created_at;
        return createdAt >= startDate && createdAt <= endDate;
      });
    }

    const totalSpending = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    const lastOrderDate =
      allOrders.length > 0
        ? allOrders.reduce((latest, order) => {
            const date = order.created_at;
            return date > latest ? date : latest;
          }, new Date(0))
        : undefined;
    const firstOrderDate =
      allOrders.length > 0
        ? allOrders.reduce((earliest, order) => {
            const date = order.created_at; 
            return date < earliest ? date : earliest;
          }, new Date())
        : undefined;

    const averageSpending = allOrders.length > 0 ? totalSpending / allOrders.length : 0;

    const {
      averageOrdersWeek = 0,
      averageOrdersMonth = 0,
      averageOrdersYear = 0,
    } = calculateAverageOrders(allOrders);

    return {
      ...customer,
      totalSpending: Number(roundToTwo(totalSpending)),
      lastOrder: lastOrderDate,
      firstOrder: firstOrderDate,
      averageSpending: Number(roundToTwo(averageSpending)),
      averageOrdersWeek: Number(roundToTwo(averageOrdersWeek)),
      averageOrdersMonth: Number(roundToTwo(averageOrdersMonth)),
      averageOrdersYear: Number(roundToTwo(averageOrdersYear)),
    };
  });

  return customersWithStats;
}
