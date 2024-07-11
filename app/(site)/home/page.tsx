"use client";

import { useState, useEffect } from "react";
import { OrderProvider } from "../orders/OrderContext";
import { TypesOfOrder } from "../types/TypesOfOrder";
import Actions from "./Actions";
import OrdersTable from "../orders/OrdersTable";
import ChoiceDialog from "../create-order/CreateOrder";
import { RefreshCcwIcon } from "lucide-react";

export default function Home() {
  const [orders, setOrders] = useState({
    [TypesOfOrder.TABLE]: [],
    [TypesOfOrder.TO_HOME]: [],
    [TypesOfOrder.PICK_UP]: [],
  });

  const fetchOrders = (type: TypesOfOrder) => {
    fetch(`/api/orders/?requestType=getOrdersByType&type=${type}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders((prevOrders) => ({
          ...prevOrders,
          [type]: data,
        }));
      })
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
    <OrderProvider onOrdersUpdate={onOrdersUpdate}>
      <div className="w-screen p-4 h-screen flex flex-col gap-2">
        <Actions />

        <RefreshCcwIcon
          className="cursor-pointer"
          onClick={() => {
            fetchOrders(TypesOfOrder.TABLE);
            fetchOrders(TypesOfOrder.PICK_UP);
            fetchOrders(TypesOfOrder.TO_HOME);
          }}
        />

        <div className="flex gap-8 h-[90%] w-full">
          {Object.values(TypesOfOrder).map((type) => (
            <div
              key={type}
              className="h-full flex gap-2 flex-col w-1/3 items-center"
            >
              <div className="flex w-full justify-between items-center">
                <div className="text-xl">{getTableName(type)}</div>
                <ChoiceDialog type={type} />
              </div>
              <OrdersTable data={orders[type]} type={type} />
            </div>
          ))}
        </div>
      </div>
    </OrderProvider>
  );
}
