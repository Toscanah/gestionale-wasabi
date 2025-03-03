import { Megaphone } from "@phosphor-icons/react";
import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import MarketingTemplatesDialog from "@/app/(site)/marketing/templates/MarketingTemplatesDialog";

export default function MarketingSection() {
  const marketingItems: SidebarMenuGroupItem[] = [
    { type: "link", label: "Marketing ai clienti", path: "/marketing" },
    { type: "component", element: <MarketingTemplatesDialog /> },
  ];

  return (
    <SidebarMenuGroup
      label="Marketing"
      icon={<Megaphone className="w-4 h-4" />}
      items={marketingItems}
    />
  );
}
