import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { CaretDown, ChartBar } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function StatsSection() {
  const statsItems = [
    { label: "Prodottti", path: "/" },
    { label: "Clienti", path: "/" },
  ];

  return (
    <SidebarMenu>
      <Collapsible className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <ChartBar className="w-4 h-4" />
              Statistiche
              <CaretDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {statsItems.map((item) => (
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link href={item.path}>
                      {/* {item.icon} */}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
