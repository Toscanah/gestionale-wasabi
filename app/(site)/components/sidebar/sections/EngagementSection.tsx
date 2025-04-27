import { Megaphone } from "@phosphor-icons/react";
import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export default function EngagementSection() {
  return (
    <SidebarMenu key={"engagement"}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={"/engagement"}>
            <Megaphone />
            <span>Marketing</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
