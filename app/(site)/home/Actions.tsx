"use client";

import { Button } from "@/components/ui/button";
import { List, PiggyBank, UsersFour } from "@phosphor-icons/react";
import RiceDialog from "../rice/RiceDialog";
import Link from "next/link";
import { useRouter } from 'next/navigation'

export default function Actions() {
  const router = useRouter()

  return (
    <div className="flex gap-4 justify-center items-center">
      {/* <ChoiceDialog /> */}

      <RiceDialog />

      <Button className="" variant={"outline"}>
        <PiggyBank className="mr-2 h-4 w-4" /> Pagamenti
      </Button>

      <Button className="" variant={"outline"}>
        <UsersFour className="mr-2 h-4 w-4" /> Gestisci clienti
      </Button>

      <Link href={"../products"}>
        <Button className="" variant={"outline"}>
          <List className="mr-2 h-4 w-4" /> Prodotti
        </Button>
      </Link>
    </div>
  );
}
