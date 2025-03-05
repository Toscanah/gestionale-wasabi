import { TableOrder } from "../../models";
import prisma from "../db";
import addProductsToOrder from "../products/addProductsToOrder";
import getOrderById from "./getOrderById";

export default async function joinTableOrders(
  originalOrderId: number,
  tableToJoin: string
): Promise<{ updatedOrder: TableOrder; joinedTable: TableOrder } | null> {
  const possibleOrdersToJoin = await prisma.order.findMany({
    where: {
      table_order: {
        table: String(tableToJoin),
      },
      state: "ACTIVE",
    },
    select: { id: true },
  });

  if (!possibleOrdersToJoin || possibleOrdersToJoin.length !== 1) {
    return null;
  }

  const orderToJoinId = possibleOrdersToJoin[0];
  const orderToJoin = await getOrderById(orderToJoinId.id);

  await addProductsToOrder(originalOrderId, orderToJoin.products);

  await Promise.all(
    orderToJoin.products.map((product) =>
      prisma.productInOrder.update({
        where: { id: product.id },
        data: { state: "DELETED_COOKED" }, // TODO: sarebbe da specificare se erano stati cucinati o meno
      })
    )
  );

  await prisma.order.update({
    where: { id: orderToJoinId.id },
    data: { state: "CANCELLED" },
  });

  return {
    updatedOrder: (await getOrderById(originalOrderId)) as TableOrder,
    joinedTable: (await getOrderById(orderToJoinId.id)) as TableOrder,
  };
}
