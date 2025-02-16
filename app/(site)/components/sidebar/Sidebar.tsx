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
import Footer from "./Footer";
import SettingsSection from "./sections/SettingsSection";
import MarketingSection from "./sections/MarketingSection";

export default function WasabiSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup key={"group-1"}>
          <SidebarGroupLabel>Generale</SidebarGroupLabel>

          <SidebarGroupContent>
            <AdminSection />
            <StatsSection />
            <PaymentSection />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator key={"sep-1"} />

        <SidebarGroup key={"group-2"}>
          <SidebarGroupLabel>Marketing</SidebarGroupLabel>

          <SidebarGroupContent>
            <MarketingSection />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator key={"sep-2"} />

        <SidebarGroup key={"group-3"}>
          <SidebarGroupLabel>Riso</SidebarGroupLabel>

          <SidebarGroupContent>
            <RiceSection />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator key={"sep-3"} />

        <SidebarGroup key={"group-4"}>
          <SidebarGroupLabel>Impostazioni</SidebarGroupLabel>

          <SidebarGroupContent>
            <SettingsSection />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Footer />
    </Sidebar>
  );
}
