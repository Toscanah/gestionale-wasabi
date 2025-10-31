import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { StarIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function PromotionSection() {
  return (
    <SidebarMenu key={"promotions"}>
      <SidebarMenuItem>
        <SidebarMenuButton className="pointer-events-none text-muted-foreground" asChild>
          <Link href={"/promotions"}>
            <StarIcon />
            <span>Promozioni</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
