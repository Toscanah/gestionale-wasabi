"use client";

import { useState, useEffect } from "react";
import { TypesOfOrder } from "../types/TypesOfOrder";
import { WasabiProvider } from "../orders/WasabiContext";
import OrdersTable from "../orders/OrdersTable";
import CreateOrder from "../create-order/CreateOrder";
import Header from "./Header";
import fetchRequest from "../util/functions/fetchRequest";
import { cn } from "@/lib/utils";

export default function Home() {
  const [orders, setOrders] = useState({
    [TypesOfOrder.TABLE]: [],
    [TypesOfOrder.TO_HOME]: [],
    [TypesOfOrder.PICK_UP]: [],
  });

  const fetchOrders = (type: TypesOfOrder) => {
    fetchRequest("GET", "/api/orders/", "getOrdersByType", { type }).then(
      (data) => {
        setOrders((prevOrders) => ({
          ...prevOrders,
          [type]: data,
        }));
      }
    );
  };

  const onOrdersUpdate = (type: TypesOfOrder) => {
    fetchOrders(type);
  };

  useEffect(() => {
    fetchOrders(TypesOfOrder.TABLE);
    fetchOrders(TypesOfOrder.PICK_UP);
    fetchOrders(TypesOfOrder.TO_HOME);
  }, []);

  return (
    <WasabiProvider onOrdersUpdate={onOrdersUpdate}>
      <div className="w-screen p-4 h-screen flex flex-col gap-2">
        <div className="w-full h-[10%] flex justify-between">
          <Header />
        </div>

        <div className="flex gap-4 h-[90%] w-full">
          {Object.values(TypesOfOrder).map((type) => (
            <div
              key={type}
              className={cn(
                "h-full flex gap-4 flex-col items-center",
                type == TypesOfOrder.TO_HOME ? "w-[40%]" : "w-[30%]"
              )}
            >
              <div className="flex w-full justify-between items-center">
                <CreateOrder type={type} />
              </div>
              <OrdersTable data={orders[type]} type={type} />
            </div>
          ))}
        </div>
      </div>
    </WasabiProvider>
  );
}
