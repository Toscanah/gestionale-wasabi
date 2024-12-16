"use client";

import { ReactNode, useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { OrderType } from "@prisma/client";
import Table from "./table/Table";
import { cn } from "@/lib/utils";
import { AnyOrder } from "@/app/(site)/models";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import OrderTable from "../single-order/OrderTable";
import { OrderProvider } from "../../context/OrderContext";
import Home from "./home/Home";
import generateEmptyOrder from "../../util/functions/generateEmptyOrder";
import Pickup from "./pickup/Pickup";

interface CreateOrderProps {
  type: OrderType;
  triggerClassName?: string;
  children?: ReactNode;
}

export default function CreateOrder({ type, triggerClassName, children }: CreateOrderProps) {
  const [order, setOrder] = useState<AnyOrder>(generateEmptyOrder(type));
  const [open, setOpen] = useState<boolean>(false);

  const components = new Map<OrderType, { name: string; component: ReactNode }>([
    [OrderType.TABLE, { name: "Ordine al tavolo", component: <Table setOrder={setOrder} /> }],
    [OrderType.HOME, { name: "Ordine a domicilio", component: <Home setOrder={setOrder} /> }],
    [OrderType.PICKUP, { name: "Ordine per asporto", component: <Pickup setOrder={setOrder} /> }],
  ]);

  useEffect(() => {
    if (open) {
      setOrder(generateEmptyOrder(type));
    }
  }, [open]);

  return (
    <DialogWrapper
      size="medium"
      open={open}
      onOpenChange={() => setOpen(!open)}
      contentClassName={cn(
        "flex flex-col gap-6 items-center",
        type === OrderType.HOME || order.id !== -1
          ? "w-[97.5vw] max-w-screen max-h-screen h-[95vh]"
          : "w-[40vw] "
      )}
      trigger={
        <Button className={cn("w-full text-2xl h-12", triggerClassName)}>
          <Plus className="mr-2 h-5 w-5" /> {components.get(type)?.name} {children}
        </Button>
      }
    >
      {order.id == -1 ? (
        <div className="w-full h-full">{components.get(type)?.component}</div>
      ) : (
        <OrderProvider order={order} dialogOpen={open} setDialogOpen={setOpen}>
          <OrderTable />
        </OrderProvider>
      )}
    </DialogWrapper>
  );
}
