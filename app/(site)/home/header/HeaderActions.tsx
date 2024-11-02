"use client";

import { Button } from "@/components/ui/button";
import { ArrowClockwise, Hash, Key, List, PiggyBank, Tag, UsersFour } from "@phosphor-icons/react";
import RiceDialog from "../../rice/RiceDialog";
import Link from "next/link";
import { useWasabiContext } from "../../context/WasabiContext";
import { OrderType } from "../../types/OrderType";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function HeaderActions() {
  const { onOrdersUpdate } = useWasabiContext();
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    {
      label: "Prodotti",
      icon: <List className="mr-2 h-4 w-4" />,
      path: "/backend/products",
    },
    {
      label: "Clienti",
      icon: <UsersFour className="mr-2 h-4 w-4" />,
      path: "/backend/customers",
    },
    {
      label: "Categorie",
      icon: <Tag className="mr-2 h-4 w-4" />,
      path: "/backend/categories",
    },
    {
      label: "Opzioni",
      icon: <Hash className="mr-2 h-4 w-4" />,
      path: "/backend/options",
    },
  ];

  return (
    <div className="flex gap-4 justify-center items-center">
      <RiceDialog />

      <Link href={"../payments/table/"}>
        <Button className="" variant={"outline"}>
          <PiggyBank className="mr-2 h-4 w-4" /> Pagamenti
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Key className="mr-2 h-4 w-4" /> Admin
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>Dove vuoi andare?</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => navigateTo(item.path)}
              className="hover:cursor-pointer"
            >
              {item.icon} {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ArrowClockwise
        className="hover:cursor-pointer"
        size={24}
        onClick={() => {
          onOrdersUpdate(OrderType.TO_HOME);
          onOrdersUpdate(OrderType.PICK_UP);
          onOrdersUpdate(OrderType.TABLE);
        }}
      />
    </div>
  );
}
