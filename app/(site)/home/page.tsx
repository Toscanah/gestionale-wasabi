"use client";

import { useState, useEffect, useRef } from "react";
import { OrderType } from "../types/OrderType";
import { WasabiProvider } from "../context/WasabiContext";
import OrdersTable from "../orders/OrdersTable";
import CreateOrder from "../orders/create-order/CreateOrder";
import Header from "./Header";
import fetchRequest from "../util/functions/fetchRequest";
import { cn } from "@/lib/utils";
import { AnyOrder, TableOrder, HomeOrder, PickupOrder } from "../types/PrismaOrders";
import { Rice } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { getPanelElement } from "react-resizable-panels";
import Link from "next/link";
import { Skull } from "@phosphor-icons/react";

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

  const onOrdersUpdate = (type: OrderType) => {
    fetchOrders(type);
  };

  const onLayout = (sizes: number[]) => {
    //console.log(leftPanelElement);
  };

  useEffect(() => {
    fetchOrders(OrderType.TABLE);
    fetchOrders(OrderType.PICK_UP);
    fetchOrders(OrderType.TO_HOME);
  }, []);

  return (
    <WasabiProvider onOrdersUpdate={onOrdersUpdate}>
      <div className="w-screen p-4 h-screen flex flex-col gap-4">
        <div className="w-full flex justify-between">
          {/* <Button onClick={() => {
            

            const table1 = getPanelElement("TABLE");
            const table2 = getPanelElement("TO_HOME");
            const table3 = getPanelElement("PICK_UP");
          

          }}>Reset</Button> */}

          <Link href={"../printing"}>
            <Button className="" variant={"outline"}>
              <Skull className="mr-2 h-4 w-4" /> Stampa
            </Button>
          </Link>
          <Header />
        </div>

        <Separator orientation="horizontal" />

        <ResizablePanelGroup direction="horizontal" onLayout={onLayout}>
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
                    />
                  </div>
                  <OrdersTable data={orders[type]} type={type} />
                </ResizablePanel>

                {type !== OrderType.PICK_UP && (
                  <ResizableHandle withHandle key={"handle-" + type} />
                )}
              </>
            );
          })}

          {/* <ResizablePanel>One</ResizablePanel>
          
          <ResizablePanel>Two</ResizablePanel>

        <div className="flex gap-4 h-[95%] w-full"></div> */}
        </ResizablePanelGroup>
      </div>
    </WasabiProvider>
  );
}
