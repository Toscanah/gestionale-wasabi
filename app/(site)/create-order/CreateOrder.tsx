"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "@phosphor-icons/react";
import { TypesOfOrder } from "../types/TypesOfOrder";
import Table from "./table/Table";
import ToHome from "./to-home/ToHome";
import PickUp from "./pick-up/PickUp";
import { cn } from "@/lib/utils";
import { AnyOrder } from "../types/OrderType";
import OrderTable from "../orders/order/OrderTable";

export default function CreateOrder({ type }: { type: TypesOfOrder }) {
  const [order, setOrder] = useState<AnyOrder | undefined>(undefined);

  const getOrderName = (type: TypesOfOrder) => {
    switch (type) {
      case TypesOfOrder.TABLE:
        return "Ordine al tavolo";
      case TypesOfOrder.TO_HOME:
        return "Ordine a domicilio";
      case TypesOfOrder.PICK_UP:
        return "Ordine per asporto";
      default:
        return "";
    }
  };

  const renderOrderComponent = (type: TypesOfOrder) => {
    const componentsMap: { [key in TypesOfOrder]: React.ElementType } = {
      [TypesOfOrder.TABLE]: Table,
      [TypesOfOrder.TO_HOME]: ToHome,
      [TypesOfOrder.PICK_UP]: PickUp,
    };

    const Component = componentsMap[type];
    return <Component setOrder={setOrder} />;
  };

  return (
    <Dialog
      onOpenChange={() => {
        setOrder(undefined);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full text-2xl h-12">
          <Plus className="mr-2 h-5 w-5" /> {getOrderName(type)}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          (type === TypesOfOrder.TO_HOME || order) &&
            "w-[90vw] max-w-screen max-h-screen h-[90vh] flex flex-col gap-6 items-center"
        )}
      >
        {!order ? (
          <div className="w-full h-full ">{renderOrderComponent(type)}</div>
        ) : (
          <OrderTable order={order as any} />
        )}
      </DialogContent>
    </Dialog>
  );
}
