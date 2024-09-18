"use client";

import { Button } from "@/components/ui/button";
import { ArrowClockwise, List, PiggyBank, Shield, UsersFour } from "@phosphor-icons/react";
import RiceDialog from "../rice/RiceDialog";
import Link from "next/link";
import { useWasabiContext } from "../context/WasabiContext";
import { OrderType } from "../types/OrderType";

export default function Actions() {
  const { onOrdersUpdate } = useWasabiContext();

  return (
    <div className="flex gap-4 justify-center items-center">
      <RiceDialog />

      <Link href={"../payments/table/"}>
        <Button className="" variant={"outline"}>
          <PiggyBank className="mr-2 h-4 w-4" /> Pagamenti
        </Button>
      </Link>

      <Link href={"../backend"}>
        <Button className="" variant={"outline"}>
          <Shield className="mr-2 h-4 w-4" /> Admin
        </Button>
      </Link>

      <ArrowClockwise
      size={32}
        onClick={() => {
          onOrdersUpdate(OrderType.TO_HOME);
          onOrdersUpdate(OrderType.PICK_UP);
          onOrdersUpdate(OrderType.TABLE);
        }}
      />
    </div>
  );
}
