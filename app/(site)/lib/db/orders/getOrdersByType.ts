import { OrderStatus, OrderType, ProductInOrderStatus } from "@prisma/client";
import prisma from "../db";
import {
  engagementsInclude,
  homeOrderInclude,
  pickupOrderInclude,
  productInOrderInclude,
} from "../includes";
import { HomeOrder, OrderByType, PickupOrder, TableOrder } from "@/app/(site)/lib/shared";

async function fetchOrdersByType(type: OrderType): Promise<OrderByType[]> {
  const orders = await prisma.order.findMany({
    include: {
      products: {
        where: { status: ProductInOrderStatus.IN_ORDER },
        include: { ...productInOrderInclude },
      },
      payments: true,
      ...homeOrderInclude,
      ...pickupOrderInclude,
      table_order: true,
      ...engagementsInclude,
    },
    where: { type, status: OrderStatus.ACTIVE },
    orderBy: { created_at: "asc" },
  });

  return orders.map((order) => {
    const unpaidProducts = order.products
      .filter((p) => (p.paid_quantity ?? 0) < p.quantity)
      .map((p) => ({
        ...p,
        quantity: p.quantity - (p.paid_quantity ?? 0),
      }));

    return {
      ...order,
      type, // literal override so TS narrows
      products: unpaidProducts,
    } as OrderByType;
  });
}

export async function getTableOrders(): Promise<TableOrder[]> {
  const orders = await fetchOrdersByType(OrderType.TABLE);
  return orders as TableOrder[];
}

export async function getHomeOrders(): Promise<HomeOrder[]> {
  const orders = await fetchOrdersByType(OrderType.HOME);
  return orders as HomeOrder[];
}

export async function getPickupOrders(): Promise<PickupOrder[]> {
  const orders = await fetchOrdersByType(OrderType.PICKUP);
  return orders as PickupOrder[];
}
