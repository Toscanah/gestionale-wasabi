"use client";

import { ReactNode, useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { OrderType } from "@prisma/client";
import Table from "./table/Table";
import ToHome from "./to-home/ToHome";
import PickUp from "./pick-up/PickUp";
import { cn } from "@/lib/utils";
import { AnyOrder } from "../../types/PrismaOrders";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import OrderTable from "../single-order/OrderTable";
import { OrderProvider } from "../../context/OrderContext";

export default function CreateOrder({
  type,
  triggerClassName,
  children,
}: {
  type: OrderType;
  triggerClassName?: string;
  children?: ReactNode;
}) {
  const [order, setOrder] = useState<AnyOrder | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);

  const components = new Map<OrderType, { name: string; component: ReactNode }>([
    [OrderType.TABLE, { name: "Ordine al tavolo", component: <Table setOrder={setOrder} /> }],
    [OrderType.TO_HOME, { name: "Ordine a domicilio", component: <ToHome setOrder={setOrder} /> }],
    [OrderType.PICK_UP, { name: "Ordine per asporto", component: <PickUp setOrder={setOrder} /> }],
  ]);

  useEffect(() => {
    setOrder(undefined);
  }, [open]);

  return (
    <DialogWrapper
      open={open}
      hasHeader={false}
      onOpenChange={() => {
        setOpen(!open);
      }}
      contentClassName={cn(
        "flex flex-col gap-6 items-center",
        type === OrderType.TO_HOME || order
          ? "w-[97.5vw] max-w-screen max-h-screen h-[95vh]"
          : "w-[40vw] "
      )}
      trigger={
        <Button className={cn("w-full text-2xl h-12", triggerClassName)}>
          <Plus className="mr-2 h-5 w-5" /> {components.get(type)?.name} {children}
        </Button>
      }
    >
      {!order ? (
        <div className="w-full h-full">{components.get(type)?.component}</div>
      ) : (
        <OrderProvider order={order} dialogOpen={open} setDialogOpen={setOpen} setOrder={setOrder}>
          <OrderTable />
        </OrderProvider>
      )}
    </DialogWrapper>
  );
}
