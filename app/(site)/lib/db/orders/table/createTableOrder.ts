import { OrderStatus, OrderType } from "@prisma/client";
import prisma from "../../db";
import { OrderContracts, TableOrder } from "@/app/(site)/lib/shared";
import { engagementsInclude, productsInOrderInclude } from "../../includes";
import { updateOrderShift } from "../updateOrderShift";
import { isTableOrder } from "../../../utils/domains/order/orderParser";
import { getOrderById } from "../getOrderById";

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
    },
  });

  await updateOrderShift({ orderId: newOrder.id });

  const updatedOrder = await getOrderById({ orderId: newOrder.id, type: OrderType.TABLE });

  // ✅ TS now knows this is a TableOrder
  return { order: updatedOrder, isNewOrder: true };
}
