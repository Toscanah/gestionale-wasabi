import RiceDefaultValues from "@/app/(site)/rice/RiceDefaultValues";
import RiceDialog from "@/app/(site)/rice/RiceDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { CookingPot } from "@phosphor-icons/react";
import { ChevronDown } from "lucide-react";

export default function RiceSection() {
  const riceItems = [<RiceDialog variant="sidebar" />, <RiceDefaultValues />];

  return (
    <SidebarMenu>
      <Collapsible className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <CookingPot className="w-4 h-4" />
              Riso
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {riceItems.map((item: JSX.Element) => (
                <SidebarMenuSubItem>{item}</SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
