"use client";

import { WasabiProvider } from "../../context/WasabiContext";
import { OrderType } from "@prisma/client";
import { TableOrder, HomeOrder, PickupOrder, AnyOrder } from "@/app/(site)/lib/shared";
import HomePage from "./HomePage";
import { trpc } from "@/lib/server/client";
import { ordersAPI } from "@/lib/server/api";

export type BuildOrderState<TTable, THome, TPickup> = {
  [OrderType.TABLE]: TTable;
  [OrderType.HOME]: THome;
  [OrderType.PICKUP]: TPickup;
};

type Orders = BuildOrderState<TableOrder[], HomeOrder[], PickupOrder[]>;

type UpdateStateAction = "update" | "delete" | "add";

export default function HomeWrapper() {
  const utils = trpc.useUtils();

  const {
    data: homeOrders = [],
    isLoading: homeLoading,
    isFetching: homeFetching,
  } = ordersAPI.getHomeOrders.useQuery();

  const {
    data: pickupOrders = [],
    isLoading: pickupLoading,
    isFetching: pickupFetching,
  } = ordersAPI.getPickupOrders.useQuery();

  const {
    data: tableOrders = [],
    isLoading: tableLoading,
    isFetching: tableFetching,
  } = ordersAPI.getTableOrders.useQuery();

  const orders: Orders = {
    [OrderType.HOME]: homeOrders,
    [OrderType.PICKUP]: pickupOrders,
    [OrderType.TABLE]: tableOrders,
  };

  const loadings = {
    [OrderType.HOME]: homeLoading || homeFetching,
    [OrderType.PICKUP]: pickupLoading || pickupFetching,
    [OrderType.TABLE]: tableLoading || tableFetching,
  };

  const updateGlobalState = (order: AnyOrder, action: UpdateStateAction) => {
    const cacheUpdaters: Record<OrderType, (updater: (prev: any[]) => any[]) => void> = {
      [OrderType.HOME]: (updater: (prev: HomeOrder[]) => HomeOrder[]) =>
        utils.orders.getHomeOrders.setData(undefined, (prev = []) => updater(prev)),
      [OrderType.PICKUP]: (updater: (prev: PickupOrder[]) => PickupOrder[]) =>
        utils.orders.getPickupOrders.setData(undefined, (prev = []) => updater(prev)),
      [OrderType.TABLE]: (updater: (prev: TableOrder[]) => TableOrder[]) =>
        utils.orders.getTableOrders.setData(undefined, (prev = []) => updater(prev)),
    };

    const updateFn = (prev: AnyOrder[]) => {
      const actions: Record<UpdateStateAction, () => AnyOrder[]> = {
        update: () => prev.map((o) => (o.id === order.id ? order : o)),
        delete: () => prev.filter((o) => o.id !== order.id),
        add: () => [...prev, order],
      };
      return actions[action]();
    };

    cacheUpdaters[order.type](updateFn);
  };

  return (
    <WasabiProvider updateGlobalState={updateGlobalState}>
      <HomePage orders={orders} loadings={loadings} />
    </WasabiProvider>
  );
}
