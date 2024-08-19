import { OrderType } from "../../types/OrderType";
import { AnyOrder } from "../../types/PrismaOrders";
import prisma from "../db";

export default async function getOrdersByType(type: OrderType): Promise<AnyOrder[] | undefined> {
  const orders = await prisma.order.findMany({
    include: {
      products: {
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    select: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: {
            select: {
              option: true,
            },
          },
        },
      },
      payments: true,
      home_order: {
        include: { address: true, customer: true },
      },
      pickup_order: {
        include: { customer: true },
      },
      table_order: {
        include: {
          table: true,
        },
      },
    },
    where: {
      type: type,
    },
  });

  // Iterate through orders to check and update the total if necessary
  for (const order of orders) {
    const calculatedTotal = order.products.reduce(
      (sum, productInOrder) => sum + productInOrder.total,
      0
    );

    if (order.total !== calculatedTotal) {
      await prisma.order.update({
        where: { id: order.id },
        data: { total: calculatedTotal },
      });
    }
  }

  // Fetch orders again to get updated totals if any were changed
  const updatedOrders = await prisma.order.findMany({
    include: {
      products: {
        include: {
          product: {
            include: {
              category: {
                include: {
                  options: {
                    select: {
                      option: true,
                    },
                  },
                },
              },
            },
          },
          options: {
            select: {
              option: true,
            },
          },
        },
      },
      payments: true,
      home_order: {
        include: { address: true, customer: true },
      },
      pickup_order: {
        include: { customer: true },
      },
      table_order: {
        include: {
          table: true,
        },
      },
    },
    where: {
      type: type,
    },
  });

  return updatedOrders;
}
