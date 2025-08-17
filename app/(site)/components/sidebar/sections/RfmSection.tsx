import { SidebarMenuGroup, SidebarMenuGroupItem } from "../SidebarMenuGroup";
import { HashStraight } from "@phosphor-icons/react";
import RFMRanksDialog from "@/app/(site)/(domains)/engagement/rfm/ranks/RFMRanksDialog";
import RFMRulesDialog from "@/app/(site)/(domains)/engagement/rfm/rules/RFMRulesDialog";

export default function RfmSection() {
  const rfmItems: SidebarMenuGroupItem[] = [
    { type: "component", element: <RFMRulesDialog /> },
    { type: "component", element: <RFMRanksDialog /> },
  ];

  return (
    <SidebarMenuGroup label="RFM" icon={<HashStraight className="w-4 h-4" />} items={rfmItems} />
  );
}
