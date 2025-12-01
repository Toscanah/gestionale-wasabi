import { OrderContracts } from "@/app/(site)/lib/shared";
import prisma from "../../prisma";
import { OrderStatus, OrderType, ProductInOrderStatus } from "@/prisma/generated/client/enums";
import addProductsToOrder from "../../products/addProductsToOrder";
import { getOrderById } from "../getOrderById";

export default async function joinTableOrders({
  originalOrderId,
  tableToJoin,
}: OrderContracts.JoinTables.Input): Promise<OrderContracts.JoinTables.Output> {
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
    throw new Error("Unable to join tables: table to join not found or not unique");
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
    updatedOrder: await getOrderById({ orderId: originalOrderId, type: OrderType.TABLE }),
    joinedTable: await getOrderById({ orderId: orderToJoinId.id, type: OrderType.TABLE }),
  };
}
