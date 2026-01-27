import { Megaphone } from "@phosphor-icons/react";
import { SidebarMenuSubButton } from "@/components/ui/sidebar";
import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import MarketingTemplates from "@/app/(site)/(domains)/engagement/templates/MarketingTemplates";
import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import { trpc } from "@/lib/trpc/client";

export default function EngagementSection() {
  const utils = trpc.useUtils();

  const EngagementModels = () => (
    <WasabiDialog
      onOpenChange={(open) => {
        if (!open) {
          utils.orders.getHomeOrders.invalidate();
          utils.orders.getPickupOrders.invalidate();
          utils.orders.getTableOrders.invalidate();
        }
      }}
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
