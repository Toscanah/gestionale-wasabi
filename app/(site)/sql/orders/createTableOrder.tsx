import { OrderType } from "@prisma/client";
import prisma from "../db";

export default async function createTableOrder(content: {
  table: string;
  people: number;
  res_name?: string;
}) {
  const { table, people, res_name } = content;

  const existingOrder = await prisma.order.findFirst({
    where: {
      type: OrderType.TABLE,
      table_order: {
        table: table,
      },
      state: "ACTIVE",
    },
    include: {
      table_order: true,
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
  });

  if (existingOrder) {
    return { order: existingOrder, new: false };
  }

  const newOrder = await prisma.order.create({
    data: {
      type: OrderType.TABLE,
      total: 0,
      table_order: {
        create: {
          table: table,
          res_name: res_name ?? "",
          people: Number(people),
        },
      },
    },
    include: {
      table_order: true,
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
  });

  return { order: newOrder, new: true };
}
