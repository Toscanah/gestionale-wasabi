"use client";

import { ReactNode, useState } from "react";

import { Plus } from "@phosphor-icons/react";
import { OrderType } from "../types/OrderType";
import Table from "./table/Table";
import ToHome from "./to-home/ToHome";
import PickUp from "./pick-up/PickUp";
import { cn } from "@/lib/utils";
import { AnyOrder } from "../types/PrismaOrders";
import OrderTable from "../orders/order/OrderTable";
import DialogWrapper from "../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";

export default function CreateOrder({ type }: { type: OrderType }) {
  const [order, setOrder] = useState<AnyOrder | undefined>(undefined);

  const components = new Map<OrderType, { name: string; component: ReactNode }>([
    [OrderType.TABLE, { name: "Ordine al tavolo", component: <Table setOrder={setOrder} /> }],
    [OrderType.TO_HOME, { name: "Ordine a domicilio", component: <ToHome setOrder={setOrder} /> }],
    [OrderType.PICK_UP, { name: "Ordine per asporto", component: <PickUp setOrder={setOrder} /> }],
  ]);

  return (
    <DialogWrapper
      onOpenChange={() => setOrder(undefined)}
      contentClassName={cn(
        "flex flex-col gap-6 items-center",
        type === OrderType.TO_HOME || order ? "w-[90vw] h-[90vh]" : "w-[40vw] "
      )}
      trigger={
        <Button className="w-full text-2xl h-12">
          <Plus className="mr-2 h-5 w-5" /> {components.get(type)?.name}
        </Button>
      }
    >
      {!order ? (
        <div className="w-full h-full ">{components.get(type)?.component}</div>
      ) : (
        <OrderTable order={order as any} />
      )}
    </DialogWrapper>
  );
}
