"use client";

import { useEffect, useState } from "react";
import { WasabiProvider } from "../context/WasabiContext";
import { OrderType } from "@prisma/client";
import { TableOrder, HomeOrder, PickupOrder, AnyOrder } from "@/app/(site)/lib/shared";
import HomePage from "./HomePage";
import fetchRequest from "../lib/core/fetchRequest";

export type BuildOrderState<TTable, THome, TPickup> = {
  [OrderType.TABLE]: TTable;
  [OrderType.HOME]: THome;
  [OrderType.PICKUP]: TPickup;
};

type Orders = BuildOrderState<TableOrder[], HomeOrder[], PickupOrder[]>;

type UpdateStateAction = "update" | "delete" | "add";

export default function HomeWrapper() {
  const [orders, setOrders] = useState<Orders>({
    [OrderType.TABLE]: [],
    [OrderType.HOME]: [],
    [OrderType.PICKUP]: [],
  });

  // DO NOT CHANGE! THIS IS SO DELICATE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const updateGlobalState = (order: AnyOrder, action: UpdateStateAction) =>
    setOrders((prevOrders) => {
      const existingOrders = prevOrders[order.type] || [];

      const actions: Record<UpdateStateAction, () => typeof prevOrders> = {
        update: () => ({
          ...prevOrders,
          [order.type]: existingOrders.map((existingOrder) =>
            existingOrder.id === order.id ? order : existingOrder
          ),
        }),

        delete: () => ({
          ...prevOrders,
          [order.type]: existingOrders.filter((existingOrder) => existingOrder.id !== order.id),
        }),

        add: () => ({
          ...prevOrders,
          [order.type]: [...existingOrders, order],
        }),
      };

      return actions[action]?.() ?? prevOrders;
    });

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
