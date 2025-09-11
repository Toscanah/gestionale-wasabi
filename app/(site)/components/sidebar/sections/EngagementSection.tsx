import { Megaphone } from "@phosphor-icons/react";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import MarketingTemplates from "@/app/(site)/(domains)/engagement/templates/MarketingTemplates";
import WasabiDialog from "../../ui/wasabi/WasabiDialog";

export default function EngagementSection() {
  const EngagementModels = () => (
    <WasabiDialog
      // onOpenChange={(open) => {
      //   if (!open) {
      //     window.location.reload();
      //   }
      // }}
      title="Modelli marketing"
      size="medium"
      putUpperBorder
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer">Modelli</SidebarMenuSubButton>
      }
    >
      <MarketingTemplates />
    </WasabiDialog>
  );

  const engagementItems: SidebarMenuGroupItem[] = [
    { type: "link", path: "/engagement/broadcasting", label: "Ai clienti" },
    {
      type: "component",
      element: <EngagementModels />,
    },
  ];

  return (
    <SidebarMenuGroup
      label="Marketing"
      icon={<Megaphone className="w-4 h-4" />}
      items={engagementItems}
    />
  );
}
