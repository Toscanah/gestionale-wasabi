import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import AdminSection from "./sections/AdminSection";
import StatsSection from "./sections/StatsSection";
import PaymentSection from "./sections/PaymentSection";
import RiceSection from "./sections/RiceSection";
import KitchenSettings from "./sections/KitchenSettingsSection";

export default function WasabiSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pannello impostazioni</SidebarGroupLabel>

          <SidebarGroupContent>
            <AdminSection />
            <StatsSection />
            <PaymentSection />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <RiceSection />
            <KitchenSettings />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
