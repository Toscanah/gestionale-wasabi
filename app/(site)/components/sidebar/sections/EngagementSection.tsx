import { Megaphone, WindowsLogo } from "@phosphor-icons/react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import MarketingTemplates from "@/app/(site)/engagement/templates/MarketingTemplates";
import DialogWrapper from "../../ui/dialog/DialogWrapper";
import { Accordion } from "@/components/ui/accordion";

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
      contentClassName="border-t-4 border-t-gray-400"
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
