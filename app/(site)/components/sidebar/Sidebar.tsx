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
import { Fragment } from "react";
import EngagementSection from "./sections/EngagementSection";
import RfmSection from "./sections/RfmSection";
import PromotionSection from "./sections/PromotionSection";

type SidebarSection = {
  label: string;
  components: (() => React.ReactNode)[];
};

const sidebarSections: SidebarSection[] = [
  {
    label: "Generale",
    components: [AdminSection, StatsSection, PaymentSection],
  },
  {
    label: "Marketing",
    components: [PromotionSection, EngagementSection, RfmSection],
  },
  {
    label: "Riso",
    components: [RiceSection],
  },
  {
    label: "Impostazioni",
    components: [SettingsSection],
  },
];

export default function WasabiSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {sidebarSections.map((section, index) => (
          <Fragment key={index}>
            <SidebarGroup>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                {section.components.map((Component, idx) => (
                  <Component key={`${index}-comp-${idx}`} />
                ))}
              </SidebarGroupContent>
            </SidebarGroup>

            {index < sidebarSections.length - 1 && (
              <SidebarSeparator className="!w-auto" key={`sep-${index}`} />
            )}
          </Fragment>
        ))}
      </SidebarContent>

      <Footer />
    </Sidebar>
  );
}
