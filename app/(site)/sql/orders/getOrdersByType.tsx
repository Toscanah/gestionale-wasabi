import { TypesOfOrder } from "../../types/TypesOfOrder";
import prisma from "../db";

export default async function getOrdersByType(type: TypesOfOrder) {
  return await prisma.order.findMany({
    include: {
      products: {
        include: {
          product: {
            include: {
              options: {
                include: {
                  option: true,
                },
              },
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
        },
      },
      payment: true,
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
