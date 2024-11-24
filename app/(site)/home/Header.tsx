"use client";

import RiceDialog from "../rice/RiceDialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RiceSummary from "../rice/RiceSummary";
import KitchenOffset from "../components/KitchenOffset";
import { OrderType } from "@prisma/client";

export default function Header({
  toggleOrder,
  activeOrders,
}: {
  toggleOrder: (type: OrderType) => void;
  activeOrders: {
    [OrderType.TABLE]: boolean;
    [OrderType.TO_HOME]: boolean;
    [OrderType.PICK_UP]: boolean;
  };
}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <RiceDialog variant="header" />
          <KitchenOffset variant="header" />
        </div>

        <div className="flex justify-evenly w-full">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="table-orders"
              checked={activeOrders[OrderType.TABLE]}
              onCheckedChange={() => toggleOrder(OrderType.TABLE)}
            />
            <Label htmlFor="table-orders">Tavoli</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="home-orders"
              checked={activeOrders[OrderType.TO_HOME]}
              onCheckedChange={() => toggleOrder(OrderType.TO_HOME)}
            />
            <Label htmlFor="home-orders">Domicilio</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pickup-orders"
              checked={activeOrders[OrderType.PICK_UP]}
              onCheckedChange={() => toggleOrder(OrderType.PICK_UP)}
            />
            <Label htmlFor="pickup-orders">Asporto</Label>
          </div>
        </div>
      </div>
      
      <RiceSummary />
    </>
  );
}
