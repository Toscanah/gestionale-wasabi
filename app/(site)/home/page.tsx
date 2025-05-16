"use client";

import { useEffect, useState } from "react";
import { WasabiProvider } from "../context/WasabiContext";
import { OrderType } from "@prisma/client";
import { TableOrder, HomeOrder, PickupOrder, AnyOrder } from "@shared";
import HomePage from "./HomePage";
import fetchRequest from "../lib/api/fetchRequest";

export type BuildOrderState<TTable, THome, TPickup> = {
  [OrderType.TABLE]: TTable;
  [OrderType.HOME]: THome;
  [OrderType.PICKUP]: TPickup;
};

type UpdateStateAction = "update" | "delete" | "add";

export default function HomeWrapper() {
  const [orders, setOrders] = useState<BuildOrderState<TableOrder[], HomeOrder[], PickupOrder[]>>({
    [OrderType.TABLE]: [],
    [OrderType.HOME]: [],
    [OrderType.PICKUP]: [],
  });

  const updateGlobalState = (order: AnyOrder, action: "update" | "delete" | "add") => {
    const existingOrders = orders[order.type] || [];

    const actions = {
      update: () => ({
        ...orders,
        [order.type]: existingOrders.map((o) => (o.id === order.id ? order : o)),
      }),
      delete: () => ({
        ...orders,
        [order.type]: existingOrders.filter((o) => o.id !== order.id),
      }),
      add: () => ({
        ...orders,
        [order.type]: [...existingOrders, order],
      }),
    };

    setOrders(actions[action] ?? orders);
  };

  const fetchOrdersByType = async <T,>(type: OrderType): Promise<T> =>
    await fetchRequest<T>("GET", "/api/orders", "getOrdersByType", {
      type,
    });

  const fetchInitialOrders = async () =>
    setOrders({
      [OrderType.HOME]: await fetchOrdersByType<HomeOrder[]>(OrderType.HOME),
      [OrderType.PICKUP]: await fetchOrdersByType<PickupOrder[]>(OrderType.PICKUP),
      [OrderType.TABLE]: await fetchOrdersByType<TableOrder[]>(OrderType.TABLE),
    });

  useEffect(() => {
    fetchInitialOrders();
  }, []);

  return (
    <WasabiProvider updateGlobalState={updateGlobalState}>
      <HomePage orders={orders} />
    </WasabiProvider>
  );
}
