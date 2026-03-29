import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { HeartIcon, SpeedometerIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function CapacitySection() {
  return (
    <SidebarMenu key={"orders-capacity"}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={"/orders/capacity"}>
            <SpeedometerIcon />
            <span>Capacità</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
