import { OrderType } from "@prisma/client";
import prisma from "../db";
import { AnyOrder, TableOrder } from "../../models";
import { productsInOrderInclude } from "../includes";

export default async function createTableOrder(
  table: string,
  people: number,
  resName?: string
): Promise<{ order: TableOrder; isNewOrder: boolean }> {
  const existingOrder = await prisma.order.findFirst({
    where: {
      type: OrderType.TABLE,
      table_order: {
        table: table,
      },
      state: "ACTIVE",
    },
    include: {
      payments: true,
      table_order: true,
      ...productsInOrderInclude,
    },
  });

  if (existingOrder) {
    return { order: existingOrder, isNewOrder: false };
  }

  const newOrder = await prisma.order.create({
    data: {
      type: OrderType.TABLE,
      total: 0,
      table_order: {
        create: {
          table: table,
          res_name: resName ?? "",
          people: Number(people),
        },
      },
    },
    include: {
      payments: true,
      table_order: true,
      ...productsInOrderInclude,
    },
  });

  return { order: newOrder, isNewOrder: true };
}
