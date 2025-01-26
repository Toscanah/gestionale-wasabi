import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import GlobalSettingsDialog from "../../dialog/GlobalSettingsDialog";

export default function GlobalSettingsSection() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <GlobalSettingsDialog />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
