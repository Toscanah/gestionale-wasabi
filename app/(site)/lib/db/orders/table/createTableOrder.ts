import { OrderStatus, OrderType } from "@prisma/client";
import prisma from "../../db";
import { TableOrder } from "@/app/(site)/lib/shared";
import { engagementsInclude, productsInOrderInclude } from "../../includes";

export default async function createTableOrder({
  table,
  people,
  resName,
}: {
  table: string;
  people: number;
  resName?: string;
}): Promise<{ order: TableOrder; isNewOrder: boolean }> {
  const existingOrder = await prisma.order.findFirst({
    where: {
      type: OrderType.TABLE,
      table_order: {
        table: table,
      },
      status: OrderStatus.ACTIVE,
    },
    include: {
      payments: true,
      table_order: true,
      ...productsInOrderInclude,
      ...engagementsInclude,
    },
  });

  if (existingOrder) {
    return { order: existingOrder, isNewOrder: false };
  }

  const newOrder = await prisma.order.create({
    data: {
      type: OrderType.TABLE,
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
      ...engagementsInclude,
    },
  });

  return { order: newOrder, isNewOrder: true };
}
