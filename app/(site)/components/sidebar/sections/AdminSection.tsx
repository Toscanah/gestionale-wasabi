import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { CaretDown } from "@phosphor-icons/react";

import Link from "next/link";
import { UserCircleGear } from "@phosphor-icons/react/dist/ssr";

export default function AdminSection() {
  const adminItems: { label: string; path: string }[] = [
    {
      label: "Clienti",
      path: "/backend/customers",
    },
    {
      label: "Prodotti",
      path: "/backend/products",
    },
    {
      label: "Categorie",
      path: "/backend/categories",
    },
    {
      label: "Opzioni",
      path: "/backend/options",
    },
  ];

  return (
    <SidebarMenu key={"admin"}>
      <Collapsible className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <UserCircleGear className="w-4 h-4" />
              Admin
              <CaretDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {adminItems.map((item) => (
                <SidebarMenuSubItem key={item.path}>
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
