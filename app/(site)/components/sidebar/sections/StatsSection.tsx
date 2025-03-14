import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import { ChartBar } from "@phosphor-icons/react/dist/ssr";

export default function StatsSection() {
  const statsItems: SidebarMenuGroupItem[] = [
    { type: "link", label: "Clienti", path: "/statistics/customers/" },
    { type: "link", label: "Prodotti", path: "/statistics/products/" },
    { type: "link", label: "Ordini", path: "/statistics/orders" },
  ];

  return (
    <SidebarMenuGroup
      label="Statistiche 数据分析"
      icon={<ChartBar className="w-4 h-4" />}
      items={statsItems}
    />
  );
}
