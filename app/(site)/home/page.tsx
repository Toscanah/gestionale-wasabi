"use client";

import OrdersTable from "../orders/OrdersTable";
import { TypesOfOrder } from "../types/TypesOfOrder";
import { useState, useEffect } from "react";
import { OrderType } from "../types/OrderType";

import Actions from "./Actions";
import { OrderProvider } from "../orders/OrderContext";

export default function Home() {
  const [tableOrders, setTableOrders] = useState<OrderType[]>([]);
  const [pickupOrders, setPickupOrders] = useState<OrderType[]>([]);
  const [homeOrders, setHomeOrders] = useState<OrderType[]>([]);

  const fetchOrders = (type: TypesOfOrder) => {
    fetch(`/api/orders/?requestType=getOrdersByType&type=${type}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((orders: OrderType[]) => {
        switch (type) {
          case TypesOfOrder.TABLE:
            setTableOrders(orders);
            return;
          case TypesOfOrder.PICK_UP:
            setPickupOrders(orders);
            return;
          case TypesOfOrder.TO_HOME:
            setHomeOrders(orders);
            return;
        }
      });
  };

  const onOrdersUpdate = (type: TypesOfOrder) => {
    

    switch (type) {
      case TypesOfOrder.TABLE:
        fetchOrders(TypesOfOrder.TABLE);
        return;
      case TypesOfOrder.PICK_UP:
        fetchOrders(TypesOfOrder.PICK_UP);
        return;
      case TypesOfOrder.TO_HOME:
        fetchOrders(TypesOfOrder.TO_HOME);
        return;
    }
  };

  useEffect(() => {
    fetchOrders(TypesOfOrder.TABLE);
    //fetchOrders(TypesOfOrder.TO_HOME);
    //fetchOrders(TypesOfOrder.PICK_UP);
  }, []);

  return (
    <OrderProvider onOrdersUpdate={onOrdersUpdate}>
      <div className="w-screen p-4 h-screen flex flex-col gap-2 ">
        <Actions />

        <div className="flex gap-4 h-[90%]">
          <OrdersTable data={tableOrders} type={TypesOfOrder.TABLE} />
          <OrdersTable data={homeOrders} type={TypesOfOrder.TO_HOME} />
          <OrdersTable data={pickupOrders} type={TypesOfOrder.PICK_UP} />
        </div>
      </div>
    </OrderProvider>
  );
}
