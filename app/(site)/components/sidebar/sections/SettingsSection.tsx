import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import SettingsDialog from "../../settings/SettingsDialog";

export default function SettingsSection() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SettingsDialog />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
