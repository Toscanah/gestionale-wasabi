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
import Footer from "./Footer";

export default function WasabiSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup key={"group-1"}>
          <SidebarGroupLabel>Pannello impostazioni</SidebarGroupLabel>

          <SidebarGroupContent>
            <AdminSection />
            <StatsSection />
            <PaymentSection />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup key={"group-2"}>
          <SidebarGroupContent>
            <RiceSection />
            <KitchenSettings />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Footer />
    </Sidebar>
  );
}
