import { TableOrder } from "@/app/(site)/lib/shared";
import prisma from "../../db";
import { OrderStatus, ProductInOrderStatus } from "@prisma/client";
import getOrderById from "../getOrderById";
import addProductsToOrder from "../../products/addProductsToOrder";

export default async function joinTableOrders({
  originalOrderId,
  tableToJoin,
}: {
  originalOrderId: number;
  tableToJoin: string;
}): Promise<{ updatedOrder: TableOrder; joinedTable: TableOrder } | null> {
  const possibleOrdersToJoin = await prisma.order.findMany({
    where: {
      table_order: {
        table: String(tableToJoin),
      },
      status: OrderStatus.ACTIVE,
    },
    select: { id: true },
  });

  if (!possibleOrdersToJoin || possibleOrdersToJoin.length !== 1) {
    return null;
  }

  const orderToJoinId = possibleOrdersToJoin[0];
  const orderToJoin = await getOrderById({ orderId: orderToJoinId.id });

  await addProductsToOrder({ orderId: originalOrderId, products: orderToJoin.products });

  await Promise.all(
    orderToJoin.products.map((product) =>
      prisma.productInOrder.update({
        where: { id: product.id },
        data: { status: ProductInOrderStatus.DELETED_COOKED }, // TODO: sarebbe da specificare se erano stati cucinati o meno
      })
    )
  );

  await prisma.order.update({
    where: { id: orderToJoinId.id },
    data: { status: OrderStatus.CANCELLED },
  });

  return {
    updatedOrder: (await getOrderById({ orderId: originalOrderId })) as TableOrder,
    joinedTable: (await getOrderById({ orderId: orderToJoinId.id })) as TableOrder,
  };
}
