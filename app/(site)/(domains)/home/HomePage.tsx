"use client";

import { useState, Fragment, useMemo } from "react";
import { OrderType } from "@prisma/client";
import { useWasabiContext } from "../../context/WasabiContext";
import OrdersTable from "../orders/OrdersTable";
import CreateOrder from "../orders/create-order/CreateOrder";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import Header from "./Header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import WasabiSidebar from "../../components/sidebar/Sidebar";
import { OrderByType, HomeOrder, PickupOrder, TableOrder } from "@/app/(site)/lib/shared";
import getOverdrawnOrderIds from "../../lib/services/order-management/getOverdrawnOrderIds";
import { BuildOrderState } from "./page";
import dynamic from "next/dynamic";

const RandomSpinner = dynamic(() => import("../../components/ui/misc/loader/RandomSpinner"), {
  ssr: false,
});

interface HomePageProps {
  orders: BuildOrderState<TableOrder[], HomeOrder[], PickupOrder[]>;
  loadings: BuildOrderState<boolean, boolean, boolean>;
}

export default function HomePage({ orders, loadings }: HomePageProps) {
  const { rice } = useWasabiContext();

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

  const allOrdersFlat: OrderByType[] = useMemo(
    () => [...orders.TABLE, ...orders.HOME, ...orders.PICKUP],
    [orders]
  );

  const overdrawnOrderIds = useMemo(
    () => getOverdrawnOrderIds(allOrdersFlat, rice.total),
    [allOrdersFlat, rice]
  );

  const activeOrderTypes = Object.values(OrderType).filter((type) => activeOrders[type]);

  return (
    <>
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

            const isLoading = loadings[type];

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
                    isLoading={isLoading}
                    overdrawnOrderIds={overdrawnOrderIds}
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
    </>
  );
}
