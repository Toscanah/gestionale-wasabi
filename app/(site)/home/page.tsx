"use client";

import { useState, useEffect, Fragment } from "react";
import { OrderType } from "@prisma/client";
import { WasabiProvider } from "../context/WasabiContext";
import OrdersTable from "../orders/OrdersTable";
import CreateOrder from "../orders/create-order/CreateOrder";
import fetchRequest from "../lib/api/fetchRequest";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Header from "./Header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import WasabiSidebar from "../components/sidebar/Sidebar";
import { TableOrder, HomeOrder, PickupOrder, AnyOrder } from "@shared"
;

export type UpdateStateAction = "update" | "delete" | "add";

export type BuildOrderState<TTable, THome, TPickup> = {
  [OrderType.TABLE]: TTable;
  [OrderType.HOME]: THome;
  [OrderType.PICKUP]: TPickup;
};

export default function Home() {
  const [orders, setOrders] = useState<BuildOrderState<TableOrder[], HomeOrder[], PickupOrder[]>>({
    [OrderType.TABLE]: [],
    [OrderType.HOME]: [],
    [OrderType.PICKUP]: [],
  });

  const [activeOrders, setActiveOrders] = useState<BuildOrderState<boolean, boolean, boolean>>({
    [OrderType.TABLE]: true,
    [OrderType.HOME]: true,
    [OrderType.PICKUP]: true,
  });

  const toggleOrdersByType = (type: OrderType) =>
    setActiveOrders((prev) =>
      Object.keys(prev).filter((key) => prev[key as OrderType]).length === 1 && prev[type]
        ? prev
        : { ...prev, [type]: !prev[type] }
    );

  const fetchOrdersByType = async <T,>(type: OrderType): Promise<T> =>
    await fetchRequest<T>("GET", "/api/orders", "getOrdersByType", {
      type,
    });

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
-
  useEffect(() => {
    const fetchInitialOrders = async () =>
      setOrders({
        [OrderType.HOME]: await fetchOrdersByType<HomeOrder[]>(OrderType.HOME),
        [OrderType.PICKUP]: await fetchOrdersByType<PickupOrder[]>(OrderType.PICKUP),
        [OrderType.TABLE]: await fetchOrdersByType<TableOrder[]>(OrderType.TABLE),
      });

    fetchInitialOrders();
  }, []);

  const activeOrderTypes = Object.values(OrderType).filter((type) => activeOrders[type]);

  return (
    <WasabiProvider updateGlobalState={updateGlobalState}>
      <WasabiSidebar />
      <div className="w-full overflow-x-hidden p-4 h-screen flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4 text-2xl w-[28rem]">
            <SidebarTrigger /> Wasabi Sushi
          </div>

          <Header toggleOrdersByType={toggleOrdersByType} activeOrders={activeOrders} />
        </div>

        <Separator orientation="horizontal" />

        <ResizablePanelGroup direction="horizontal">
          {activeOrderTypes.map((type, index) => {
            const totalTypes = activeOrderTypes.length;
            let defaultSize;

            if (totalTypes === 1) {
              defaultSize = 100;
            } else if (totalTypes === 2) {
              defaultSize = 50;
            } else if (totalTypes === 3) {
              defaultSize = index === 1 ? 60 : 20;
            } else {
              defaultSize = 100 / totalTypes;
            }

            return (
              <Fragment key={type}>
                <ResizablePanel
                  defaultSize={defaultSize}
                  id={type}
                  className="h-full flex flex-col items-center"
                >
                  <div className="flex w-full justify-between items-center">
                    <CreateOrder
                      type={type}
                      triggerClassName={cn(
                        "rounded-none",
                        index === 0 && "rounded-tl-md",
                        index === totalTypes - 1 && "rounded-tr-md"
                      )}
                    >
                      {orders[type].length !== 0 && "(" + orders[type].length + ")"}
                    </CreateOrder>
                  </div>

                  <OrdersTable
                    data={orders[type].sort(
                      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    )}
                    type={type}
                  />
                </ResizablePanel>

                {index < totalTypes - 1 && <ResizableHandle />}
              </Fragment>
            );
          })}
          {/* mia miao mia miaaaaaaaaao, mia mia miaoo miaoooo miaoooo, mia mia mia miaaaao miao */}
        </ResizablePanelGroup>
      </div>
    </WasabiProvider>
  );
}
