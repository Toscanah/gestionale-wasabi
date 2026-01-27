import RiceDefaultValues from "@/domains/rice/default-values/RiceDefaultValues";
import RiceDialog from "@/domains/rice/RiceDialog";
import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import { CookingPot } from "@phosphor-icons/react";

export default function RiceSection() {
  const riceItems: SidebarMenuGroupItem[] = [
    { type: "component", element: <RiceDialog variant="sidebar" /> },
    { type: "component", element: <RiceDefaultValues /> },
  ];

  return (
    <SidebarMenuGroup label="Riso" icon={<CookingPot className="w-4 h-4" />} items={riceItems} />
  );
}
