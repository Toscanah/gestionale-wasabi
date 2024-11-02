"use client";

import { useState, useEffect } from "react";
import { OrderType } from "../types/OrderType";
import { WasabiProvider } from "../context/WasabiContext";
import OrdersTable from "../orders/OrdersTable";
import CreateOrder from "../orders/create-order/CreateOrder";
import Header from "./header/Header";
import fetchRequest from "../util/functions/fetchRequest";
import { cn } from "@/lib/utils";
import { AnyOrder, TableOrder, HomeOrder, PickupOrder } from "../types/PrismaOrders";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import print from "../printing/print";
import KitchenReceipt from "../printing/receipts/KitchenReceipt";

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

  const fetchOrders = (type: OrderType) => {
    fetchRequest<AnyOrder>("GET", "/api/orders/", "getOrdersByType", { type }).then((data) => {
      if (data) {
        setOrders((prevOrders) => ({
          ...prevOrders,
          [type]: data,
        }));
      }
    });
  };

  const onOrdersUpdate = (type: OrderType) => fetchOrders(type);

  useEffect(() => {
    fetchOrders(OrderType.TABLE);
    fetchOrders(OrderType.PICK_UP);
    fetchOrders(OrderType.TO_HOME);
  }, []);

  return (
    <WasabiProvider onOrdersUpdate={onOrdersUpdate}>
      <div className="w-screen p-4 h-screen flex flex-col gap-4">
        <div className="w-full flex justify-between">
          <Button
            onClick={async () => {
              await print(() => KitchenReceipt(orders[OrderType.TABLE][0]));
            }}
          >
            test cucina
          </Button>

          <Header />
        </div>

        <Separator orientation="horizontal" />

        <ResizablePanelGroup direction="horizontal">
          {Object.values(OrderType).map((type, index) => {
            return (
              <>
                <ResizablePanel
                  defaultSize={33}
                  key={type}
                  id={type}
                  className={cn(
                    "h-full flex gap- flex-col items-center",
                    type == OrderType.TO_HOME ? "w-[35%]" : "w-[32.5%]"
                  )}
                >
                  <div className="flex w-full justify-between items-center ">
                    <CreateOrder
                      type={type}
                      triggerClassName={cn(
                        "rounded-none",
                        index == 0 && "rounded-tl-md",
                        index == 2 && "rounded-tr-md"
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

                  <div className="w-full flex items-center justify-start"></div>
                </ResizablePanel>

                {type !== OrderType.PICK_UP && (
                  <ResizableHandle withHandle key={"handle-" + type} />
                )}
              </>
            );
          })}
        </ResizablePanelGroup>
      </div>
    </WasabiProvider>
  );
}
