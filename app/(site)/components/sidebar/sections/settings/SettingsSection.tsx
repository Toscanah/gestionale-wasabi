import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import SettingsDialog from "../../../settings/SettingsDialog";
import ApplicationSettings from "./ApplicationSettings";
import RestaurantSettings from "./RestaurantSettings";

export default function SettingsSection() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SettingsDialog />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
