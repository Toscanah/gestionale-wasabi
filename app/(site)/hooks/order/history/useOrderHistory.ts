import {
  getOrderTotal,
  OrderInputWithoutDiscount,
} from "@/app/(site)/lib/services/order-management/getOrderTotal";
import { ComprehensiveCustomer } from "@/app/(site)/lib/shared";
import { OrderStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import useHistoryStats from "./useHistoryStats";

interface UseOrderHistoryParams {
  customer: ComprehensiveCustomer;
}


export default function useOrderHistory({ customer }: UseOrderHistoryParams) {
  const shouldCountOrder = (order: OrderInputWithoutDiscount & { status: OrderStatus }) =>
    getOrderTotal({ order }) > 0 && order.status === OrderStatus.PAID;

  const orderTypes = [
    {
      type: "Domicilio",
      orders: customer.home_orders.filter((order) => shouldCountOrder(order.order)),
    },
    {
      type: "Asporto",
      orders: customer.pickup_orders.filter((order) => shouldCountOrder(order.order)),
    },
  ];

  const allOrders = [...customer.home_orders, ...customer.pickup_orders].filter((order) =>
    shouldCountOrder(order.order)
  );

  return {
    orderTypes,
    allOrders,
  }
}
