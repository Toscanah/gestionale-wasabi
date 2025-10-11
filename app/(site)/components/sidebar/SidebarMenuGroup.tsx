import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";

export type SidebarMenuGroupLinkItem = {
  type: "link";
  label: string;
  path: string;
};

export type SidebarMenuGroupComponentItem = {
  type: "component";
  element: React.JSX.Element;
};

export type SidebarMenuGroupItem = SidebarMenuGroupLinkItem | SidebarMenuGroupComponentItem;

export type SidebarMenuGroupProps = {
  label: string;
  icon: React.ReactNode;
  items: SidebarMenuGroupItem[];
  disabled?: boolean;
};

export function SidebarMenuGroup({ label, icon, items, disabled }: SidebarMenuGroupProps) {
  return (
    <SidebarMenu key={label}>
      <Collapsible className="group/collapsible" disabled={disabled}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              {icon}
              {label}
              <CaretDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {items.map((item, index) =>
                item.type === "link" ? (
                  <SidebarMenuSubItem key={item.path}>
                    <SidebarMenuSubButton asChild>
                      <Link href={item.path}>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ) : (
                  <SidebarMenuSubItem key={index}>{item.element}</SidebarMenuSubItem>
                )
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
