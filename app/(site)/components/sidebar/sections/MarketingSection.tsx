import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link, Megaphone } from "@phosphor-icons/react";
export default function MarketingSection() {
  return (
    <SidebarMenu key={"marketing"}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={"../../../marketing"}>
            <Megaphone />
            <span>Marketing</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
