"use client";

import RiceDialog from "../rice/RiceDialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RiceSummary from "../rice/RiceSummary";
import KitchenOffset from "../components/KitchenOffset";
import { OrderType } from "@prisma/client";
import { useWasabiContext } from "../context/WasabiContext";
import { Button } from "@/components/ui/button";
import DeleteOrdersBulk from "../components/DeleteOrdersBulk";

interface HeaderProps {
  toggleOrder: (type: OrderType) => void;
  activeOrders: {
    [OrderType.TABLE]: boolean;
    [OrderType.HOME]: boolean;
    [OrderType.PICKUP]: boolean;
  };
}

const orderLabels: { type: OrderType; label: string }[] = [
  { type: OrderType.TABLE, label: "Tavoli" },
  { type: OrderType.HOME, label: "Domicilio" },
  { type: OrderType.PICKUP, label: "Asporto" },
];

export default function Header({ toggleOrder, activeOrders }: HeaderProps) {
  const { selectedOrders } = useWasabiContext();

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex items-center gap-2 w-full">
          <RiceDialog variant="header" />
          {selectedOrders.length > 0 && <DeleteOrdersBulk />}
          <KitchenOffset variant="header" />
        </div>

        <div className="flex justify-evenly w-80">
          {orderLabels.map(({ type, label }) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox
                id={label}
                checked={activeOrders[type]}
                onCheckedChange={() => toggleOrder(type)}
              />
              <Label htmlFor={label}>{label}</Label>
            </div>
          ))}
        </div>
      </div>

      <RiceSummary />
    </>
  );
}
