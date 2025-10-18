import { Dispatch, SetStateAction } from "react";
import { PayingAction } from "../OrderTable";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { OrderGuards } from "@/app/(site)/lib/shared";
import TableOrderLayout from "./layouts/TableOrderLayout";
import HomeOrderLayout from "./layouts/HomeOrderLayout";
import PickupOrderLayout from "./layouts/PickupOrderLayout";

interface OrderOverviewProps {
  setAction: Dispatch<SetStateAction<PayingAction>>;
}

export default function OrderOverview({ setAction }: OrderOverviewProps) {
  const { order } = useOrderContext();

  let layout = null;

  if (OrderGuards.isTable(order)) {
    layout = <TableOrderLayout setAction={setAction} />;
  }

  if (OrderGuards.isHome(order)) {
    layout = <HomeOrderLayout order={order} setAction={setAction} />;
  }

  if (OrderGuards.isPickup(order)) {
    layout = <PickupOrderLayout order={order} setAction={setAction} />;
  }

  return <div className="w-[28%] flex flex-col gap-6 h-full">{layout}</div>;
}
