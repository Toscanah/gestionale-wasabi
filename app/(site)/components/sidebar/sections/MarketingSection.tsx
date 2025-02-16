import EmailSender from "@/app/(site)/marketing/EmailSender";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Megaphone } from "@phosphor-icons/react";
import { ChevronDown } from "lucide-react";
export default function MarketingSection() {
  const marketingItems = [<EmailSender />];

  return (
    <SidebarMenu key={"marketing"}>
      <Collapsible className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <Megaphone className="w-4 h-4" />
              Marketing
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {marketingItems.map((item: JSX.Element, index) => (
                <SidebarMenuSubItem key={index}>{item}</SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
