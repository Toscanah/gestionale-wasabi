"use client";

import { Button } from "@/components/ui/button";
import { List, PiggyBank, Shield, UsersFour } from "@phosphor-icons/react";
import RiceDialog from "../rice/RiceDialog";
import Link from "next/link";

export default function Actions() {
  return (
    <div className="flex gap-4 justify-center items-center">
      <RiceDialog />

      <Button className="" variant={"outline"}>
        <PiggyBank className="mr-2 h-4 w-4" /> Pagamenti
      </Button>

      <Link href={"../backend"}>
        <Button className="" variant={"outline"}>
          <Shield className="mr-2 h-4 w-4" /> Admin
        </Button>
      </Link>
    </div>
  );
}
