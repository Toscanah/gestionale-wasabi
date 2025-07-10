import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import SettingsDialog from "../../../domains/settings/SettingsDialog";

export default function SettingsSection() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SettingsDialog />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
