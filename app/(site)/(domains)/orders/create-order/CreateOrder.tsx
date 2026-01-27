"use client";

import { ReactNode, useEffect, useState } from "react";
import { OrderType } from "@/prisma/generated/client/enums";
import Table from "./table/Table";
import { OrderByType } from "@/lib/shared";
import generateEmptyOrder from "../../../../../lib/services/order-management/generateEmptyOrder";
import Pickup from "./pickup/Pickup";
import SearchHome from "./home/SearchHome";

interface CreateOrderProps {
  type: OrderType;
  triggerClassName?: string;
  children?: ReactNode;
}

export default function CreateOrder({ type, triggerClassName, children }: CreateOrderProps) {
  const [order, setOrder] = useState<OrderByType>(generateEmptyOrder(type));
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setOrder(generateEmptyOrder(type));
    }
  }, [open]);

  const components = new Map<OrderType, { component: ReactNode }>([
    [
      OrderType.TABLE,
      {
        component: (
          <Table setOrder={setOrder} open={open} order={order} setOpen={setOpen}>
            {children}
          </Table>
        ),
      },
    ],
    [
      OrderType.HOME,
      {
        component: (
          <SearchHome setOrder={setOrder} open={open} order={order} setOpen={setOpen}>
            {children}
          </SearchHome>
        ),
      },
    ],
    [
      OrderType.PICKUP,
      {
        component: (
          <Pickup setOrder={setOrder} order={order} open={open} setOpen={setOpen}>
            {children}
          </Pickup>
        ),
      },
    ],
  ]);

  return components.get(type)?.component;
}
