import RFMDialog from "@/app/(site)/(domains)/engagement/rfm/RFMDialog";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export default function RfmSection() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <RFMDialog />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
