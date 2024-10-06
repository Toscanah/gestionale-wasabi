"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowClockwise,
  Hash,
  List,
  PiggyBank,
  Shield,
  Tag,
  UsersFour,
} from "@phosphor-icons/react";
import RiceDialog from "../rice/RiceDialog";
import Link from "next/link";
import { useWasabiContext } from "../context/WasabiContext";
import { OrderType } from "../types/OrderType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Actions() {
  const { onOrdersUpdate } = useWasabiContext();
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex gap-4 justify-center items-center">
      <RiceDialog />

      <Link href={"../payments/table/"}>
        <Button className="" variant={"outline"}>
          <PiggyBank className="mr-2 h-4 w-4" /> Pagamenti
        </Button>
      </Link>

      {/* <Link href={"../backend"}>
        <Button className="" variant={"outline"}>
          <Shield className="mr-2 h-4 w-4" /> Admin
        </Button>
      </Link> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Admin</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuLabel>Azioni admin</DropdownMenuLabel>
          <DropdownMenuSeparator /> */}

          <DropdownMenuItem onClick={() => navigateTo("/backend/products")}>
            <List className="mr-2 h-4 w-4" /> Prodotti
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/backend/customers")}>
            <UsersFour className="mr-2 h-4 w-4" /> Clienti
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/backend/categories")}>
            <Tag className="mr-2 h-4 w-4" /> Categorie
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigateTo("/backend/options")}>
            <Hash className="mr-2 h-4 w-4" /> Opzioni
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
