import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Money } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function PaymentSection() {
  return (
    <SidebarMenu key={"payments"}>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={"/payments/history"}>
            <Money />
            <span>Pagamenti 总单</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
