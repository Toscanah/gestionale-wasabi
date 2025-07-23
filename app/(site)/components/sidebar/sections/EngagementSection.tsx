import { Megaphone } from "@phosphor-icons/react";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import MarketingTemplates from "@/app/(site)/(domains)/engagement/templates/MarketingTemplates";
import DialogWrapper from "../../ui/dialog/DialogWrapper";

export default function EngagementSection() {
  const EngagementModels = () => (
    <DialogWrapper
      // onOpenChange={(open) => {
      //   if (!open) {
      //     window.location.reload();
      //   }
      // }}
      title="Modelli marketing"
      size="medium"
      upperBorder
      trigger={
        <SidebarMenuSubButton className="hover:cursor-pointer">Modelli</SidebarMenuSubButton>
      }
    >
      <MarketingTemplates />
    </DialogWrapper>
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
