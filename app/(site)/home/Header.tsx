"use client";

import RiceDialog from "../rice/RiceDialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RiceSummary from "../rice/RiceSummary";
import KitchenOffset from "../components/KitchenOffset";
import { OrderType } from "@prisma/client";

interface HeaderProps {
  toggleOrder: (type: OrderType) => void;
  activeOrders: {
    [OrderType.TABLE]: boolean;
    [OrderType.TO_HOME]: boolean;
    [OrderType.PICK_UP]: boolean;
  };
}

const orderLabels: { type: OrderType; label: string }[] = [
  { type: OrderType.TABLE, label: "Tavoli" },
  { type: OrderType.TO_HOME, label: "Domicilio" },
  { type: OrderType.PICK_UP, label: "Asporto" },
];

export default function Header({ toggleOrder, activeOrders }: HeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <RiceDialog variant="header" />
          <KitchenOffset variant="header" />
        </div>

        <div className="flex justify-evenly w-full">
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
