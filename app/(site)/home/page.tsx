"use client";

import { useState, useEffect } from "react";
import { OrderType } from "../types/OrderType";
import { WasabiProvider } from "../context/WasabiContext";
import OrdersTable from "../orders/OrdersTable";
import CreateOrder from "../create-order/CreateOrder";
import Header from "./Header";
import fetchRequest from "../util/functions/fetchRequest";
import { cn } from "@/lib/utils";
import { AnyOrder, TableOrder, HomeOrder, PickupOrder } from "../types/PrismaOrders";

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

  useEffect(() => {
    fetchOrders(OrderType.TABLE);
    fetchOrders(OrderType.PICK_UP);
    fetchOrders(OrderType.TO_HOME);
  }, []);

  return (
    <WasabiProvider onOrdersUpdate={onOrdersUpdate}>
      <div className="w-screen p-4 h-screen flex flex-col gap-2">
        <div className="w-full h-[10%] flex justify-between">
          <Header />
        </div>

        <div className="flex gap-4 h-[90%] w-full">
          {Object.values(OrderType).map((type) => {
            return (
              <div
                key={type}
                className={cn(
                  "h-full flex gap-4 flex-col items-center",
                  type == OrderType.TO_HOME ? "w-[40%]" : "w-[30%]"
                )}
              >
                <div className="flex w-full justify-between items-center">
                  <CreateOrder type={type} />
                </div>
                <OrdersTable data={orders[type]} type={type} />
              </div>
            );
          })}
        </div>
      </div>
    </WasabiProvider>
  );
}
