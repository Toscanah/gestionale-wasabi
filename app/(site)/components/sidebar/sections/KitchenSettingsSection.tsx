import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Oven } from "@phosphor-icons/react";
import KitchenOffset from "../../KitchenOffset";

export default function KitchenSettings() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <KitchenOffset variant="sidebar" />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
