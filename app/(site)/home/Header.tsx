"use client";

import RiceDialog from "../rice/RiceDialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RiceSummary from "../rice/RiceSummary";
import { OrderType } from "@prisma/client";
import { useWasabiContext } from "../context/WasabiContext";
import DeleteOrdersBulk from "../orders/components/DeleteOrdersBulk";
import { BuildOrderState } from "./page";

interface HeaderProps {
  toggleOrdersByType: (type: OrderType) => void;
  activeOrders: BuildOrderState<boolean, boolean, boolean>;
}

const orderLabels: { type: OrderType; label: string }[] = [
  { type: OrderType.TABLE, label: "Tavoli" },
  { type: OrderType.HOME, label: "Domicilio" },
  { type: OrderType.PICKUP, label: "Asporto" },
];

export default function Header({ toggleOrdersByType, activeOrders }: HeaderProps) {
  const { selectedOrders } = useWasabiContext();

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex items-center w-full">
          {selectedOrders.length > 0 ? <DeleteOrdersBulk /> : <RiceDialog variant="header" />}
          {/* <EngagementDialog trigger={<Button>YOOOOOOOOOOO</Button>} /> */}
        </div>

        <div className="flex justify-evenly w-80">
          {orderLabels.map(({ type, label }) => (
            <div key={label} className="flex items-center space-x-2">
              <Checkbox
                id={label}
                checked={activeOrders[type]}
                onCheckedChange={() => toggleOrdersByType(type)}
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
