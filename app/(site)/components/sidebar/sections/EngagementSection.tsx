import { Megaphone } from "@phosphor-icons/react";
import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import MarketingTemplates from "@/app/(site)/engagement/templates/MarketingTemplates";

export default function EngagementSection() {
  const engagementItems: SidebarMenuGroupItem[] = [
    { type: "link", path: "/engagement/broadcasting", label: "Ai clienti" },
    { type: "component", element: <MarketingTemplates /> },
  ];

  return (
    <SidebarMenuGroup
      label="Marketing"
      icon={<Megaphone className="w-4 h-4" />}
      items={engagementItems}
    />
  );
}
