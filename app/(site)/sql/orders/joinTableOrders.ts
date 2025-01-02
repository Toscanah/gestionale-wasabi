import prisma from "../db";
import addProductsToOrder from "../products/addProductsToOrder";
import getOrderById from "./getOrderById";

export default async function joinTableOrders(originalOrderId: number, tableToJoin: string) {
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
        data: { state: "DELETED_COOKED" },
      })
    )
  );

  await prisma.order.update({
    where: { id: orderToJoinId.id },
    data: { state: "CANCELLED" },
  });

  return {
    updatedOrder: await getOrderById(originalOrderId),
    joinedTable: await getOrderById(orderToJoinId.id),
  };
}
