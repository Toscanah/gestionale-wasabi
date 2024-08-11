import { OrderType } from "../../types/OrderType";
import { AnyOrder, TableOrder } from "../../types/PrismaOrders";
import prisma from "../db";

export default async function getOrdersByType(type: OrderType): Promise<AnyOrder[] | undefined> {
  return await prisma.order.findMany({
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
}
