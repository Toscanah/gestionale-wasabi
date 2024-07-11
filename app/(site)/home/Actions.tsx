"use client";

import { cn } from "@/lib/utils";
import ChoiceDialog from "../create-order/CreateOrder";
import { Button } from "@/components/ui/button";
import { Gear, PiggyBank, UsersFour } from "@phosphor-icons/react";

export default function Actions() {
  return (
    <div className="w-full flex justify-center items-center h-[10%]">
      <div className="flex gap-4 w-1/2 justify-center items-center">
        {/* <ChoiceDialog /> */}

        <Button className="" variant={"outline"}>
          <Gear className="mr-2 h-4 w-4" /> Riso
        </Button>

        <Button className="" variant={"outline"}>
          <PiggyBank className="mr-2 h-4 w-4" /> Pagamenti
        </Button>

        <Button className="" variant={"outline"}>
          <UsersFour className="mr-2 h-4 w-4" /> Gestisci clienti
        </Button>
      </div>
    </div>
  );
}
