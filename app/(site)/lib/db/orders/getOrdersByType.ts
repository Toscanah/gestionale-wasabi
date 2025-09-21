import { OrderStatus, OrderType, ProductInOrderStatus } from "@prisma/client";
import prisma from "../db";
import { OrderContracts } from "@/app/(site)/lib/shared";
import {
  engagementsInclude,
  homeOrderInclude,
  pickupOrderInclude,
  productInOrderInclude,
} from "../includes";

export default async function getOrdersByType({
  type,
}: {
  type: OrderType;
}): Promise<OrderContracts.Common.AnyOrder[]> {
  const orders = await prisma.order.findMany({
    include: {
      products: {
        where: {
          status: ProductInOrderStatus.IN_ORDER,
        },
        include: {
          ...productInOrderInclude,
        },
      },
      payments: true,
      ...homeOrderInclude,
      ...pickupOrderInclude,
      table_order: true,
      ...engagementsInclude,
    },
    where: {
      type,
      status: OrderStatus.ACTIVE,
    },
    orderBy: {
      created_at: "asc",
    },
  });

  const adjustedOrders = orders.map((order) => {
    const unpaidProducts = order.products
      .filter((product) => (product.paid_quantity ?? 0) < product.quantity)
      .map((product) => {
        const unpaidQty = product.quantity - (product.paid_quantity ?? 0);
        return {
          ...product,
          quantity: unpaidQty,
        };
      });

    return {
      ...order,
      products: unpaidProducts,
    };
  });

  return adjustedOrders;
}
