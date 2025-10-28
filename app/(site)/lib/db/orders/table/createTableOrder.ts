import { OrderStatus, OrderType } from "@prisma/client";
import prisma from "../../db";
import { OrderContracts, TableOrder } from "@/app/(site)/lib/shared";
import { engagementsInclude, productsInOrderInclude, promotionUsagesInclude } from "../../includes";
import { updateOrderShift } from "../updateOrderShift";

export default async function createTableOrder({
  table,
  people,
  resName,
}: OrderContracts.CreateTable.Input): Promise<OrderContracts.CreateTable.Output> {
  const existingOrder = await prisma.order.findFirst({
    where: {
      type: OrderType.TABLE,
      table_order: { table },
      status: OrderStatus.ACTIVE,
    },
    include: {
      payments: true,
      table_order: true,
      ...productsInOrderInclude,
      ...engagementsInclude,
      ...promotionUsagesInclude,
    },
  });

  if (existingOrder) {
    const order: TableOrder = {
      ...existingOrder,
      type: OrderType.TABLE,
      table_order: existingOrder.table_order!, // safe because type = TABLE
    };
    return { order, isNewOrder: false };
  }

  const newOrder = await prisma.order.create({
    data: {
      type: OrderType.TABLE,
      table_order: {
        create: {
          table,
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
      ...promotionUsagesInclude,
    },
  });

  const shift = await updateOrderShift({ orderId: newOrder.id });

  if (!newOrder.table_order) {
    throw new Error("Table order creation failed");
  }

  const order: TableOrder = {
    ...newOrder,
    shift,
    type: OrderType.TABLE,
    table_order: newOrder.table_order,
  };

  return { order, isNewOrder: true };
}
