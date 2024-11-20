"use client";

import { Button } from "@/components/ui/button";
import { ArrowClockwise, ChartLine, Hash, Key, List, PiggyBank, Tag, UsersFour } from "@phosphor-icons/react";
import RiceDialog from "../rice/RiceDialog";
import Link from "next/link";
import { useWasabiContext } from "../context/WasabiContext";
import { OrderType } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import RiceSummary from "../rice/RiceSummary";
import KitchenOffset from "../components/KitchenOffset";

export default function Header() {
  
  const router = useRouter();
  const { onOrdersUpdate } = useWasabiContext();
  const navigateTo = (path: string) => router.push(path);

const iconClassName = ""



  return (
    <>
      {/* <div className="flex gap-4 justify-center items-center">
        <KitchenOffset/>

        <RiceDialog />

        <Link href={"../payments/table/"}>
          <Button variant={"outline"}>
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
            {adminItems.map((item) => (
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ChartLine className="mr-2 h-4 w-4" /> Statistiche
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Dove vuoi andare?</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statsItems.map((item) => (
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

        
      </div> */}
      <RiceSummary />
    </>
  );
}
