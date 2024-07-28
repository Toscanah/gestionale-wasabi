"use client";

import { useState, useEffect } from "react";
import { TypesOfOrder } from "../types/TypesOfOrder";
import Actions from "./Actions";
import { useWasabiContext, WasabiProvider } from "../orders/WasabiContext";
import RiceSummary from "../rice/RiceSummary";
import OrdersTable from "../orders/OrdersTable";
import CreateOrder from "../create-order/CreateOrder";
import Header from "./Header";
import fetchRequest from "../util/fetchRequest";

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

  const getTableName = (type: TypesOfOrder) => {
    switch (type) {
      case TypesOfOrder.TABLE:
        return "Tavoli";
      case TypesOfOrder.TO_HOME:
        return "Ordini a domicilio";
      case TypesOfOrder.PICK_UP:
        return "Ordini asporto";
      default:
        return "";
    }
  };

  return (
    <WasabiProvider onOrdersUpdate={onOrdersUpdate}>
      <div className="w-screen p-4 h-screen flex flex-col gap-2">
        <div className="w-full h-[10%] flex justify-between">
          <Header />
        </div>

        <div className="flex gap-8 h-[90%] w-full">
          {Object.values(TypesOfOrder).map((type) => (
            <div
              key={type}
              className="h-full flex gap-2 flex-col w-1/3 items-center"
            >
              <div className="flex w-full justify-between items-center">
                <div className="text-xl">{getTableName(type)}</div>
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
