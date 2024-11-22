"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowClockwise,
  ChartLine,
  Hash,
  Key,
  List,
  PiggyBank,
  Tag,
  UsersFour,
} from "@phosphor-icons/react";
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
  return (
    <>
      <div className="flex items-center gap-2">
        <RiceDialog variant="header" />
        <KitchenOffset variant="header" />
      </div>
      <RiceSummary />
    </>
  );
}
