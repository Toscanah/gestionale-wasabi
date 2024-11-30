"use client";

import { useState, useEffect, Fragment } from "react";
import { OrderType } from "@prisma/client";
import { WasabiProvider } from "../context/WasabiContext";
import OrdersTable from "../orders/OrdersTable";
import CreateOrder from "../orders/create-order/CreateOrder";
import fetchRequest from "../util/functions/fetchRequest";
import { cn } from "@/lib/utils";
import { AnyOrder, TableOrder, HomeOrder, PickupOrder } from "../types/PrismaOrders";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Header from "./Header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import WasabiSidebar from "../components/sidebar/Sidebar";

export default function Home() {
  const [orders, setOrders] = useState<{
    [OrderType.TABLE]: TableOrder[];
    [OrderType.TO_HOME]: HomeOrder[];
    [OrderType.PICK_UP]: PickupOrder[];
  }>({
    [OrderType.TABLE]: [],
    [OrderType.TO_HOME]: [],
    [OrderType.PICK_UP]: [],
  });

  const [activeOrders, setActiveOrders] = useState<{
    [OrderType.TABLE]: boolean;
    [OrderType.TO_HOME]: boolean;
    [OrderType.PICK_UP]: boolean;
  }>({ [OrderType.TABLE]: true, [OrderType.TO_HOME]: true, [OrderType.PICK_UP]: true });

  const toggleOrder = (type: OrderType) =>
    setActiveOrders((prev) =>
      Object.keys(prev).filter((key) => prev[key as OrderType]).length === 1 && prev[type]
        ? prev
        : { ...prev, [type]: !prev[type] }
    );

  const fetchOrders = (type: OrderType) =>
    fetchRequest<AnyOrder>("GET", "/api/orders/", "getOrdersByType", { type }).then((data) => {
      if (data) {
        setOrders((prevOrders) => ({
          ...prevOrders,
          [type]: data,
        }));
      }
    });

  const onOrdersUpdate = (type: OrderType) => fetchOrders(type);

  useEffect(() => {
    fetchOrders(OrderType.TABLE);
    fetchOrders(OrderType.PICK_UP);
    fetchOrders(OrderType.TO_HOME);
  }, []);

  const activeOrderTypes = Object.values(OrderType).filter((type) => activeOrders[type]);

  return (
    <WasabiProvider onOrdersUpdate={onOrdersUpdate}>
      <WasabiSidebar />

      <div className="w-full p-4 h-screen flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4 text-2xl w-[28rem]">
            <SidebarTrigger /> Wasabi Sushi
          </div>

          <Header toggleOrder={toggleOrder} activeOrders={activeOrders} />
        </div>

        <Separator orientation="horizontal" />

        <ResizablePanelGroup direction="horizontal">
          {activeOrderTypes.map((type, index) => (
            <Fragment key={type}>
              <ResizablePanel
                defaultSize={100 / activeOrderTypes.length}
                id={type}
                className="h-full flex flex-col items-center"
              >
                <div className="flex w-full justify-between items-center ">
                  <CreateOrder
                    type={type}
                    triggerClassName={cn(
                      "rounded-none",
                      index === 0 && "rounded-tl-md",
                      index === activeOrderTypes.length - 1 && "rounded-tr-md"
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

              {index < activeOrderTypes.length - 1 && <ResizableHandle disabled />}
            </Fragment>
          ))}
        </ResizablePanelGroup>
      </div>
    </WasabiProvider>
  );
}
