import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import GlobalSettingsDialog from "../../settings/GlobalSettingsDialog";

export default function GlobalSettingsSection() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <GlobalSettingsDialog />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
