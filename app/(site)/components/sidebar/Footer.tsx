"use client";

import { Button } from "@/components/ui/button";
import { SidebarFooter, SidebarMenu } from "@/components/ui/sidebar";
import WasabiDialog from "../ui/wasabi/WasabiDialog";
import { trpc } from "@/lib/server/client";

export default function Footer() {
  const fixMutation = trpc.orders.updateOrdersShift.useMutation({
    onSuccess: () => {
      console.log("success");
    },
  });

  return (
    <SidebarFooter>
      <SidebarMenu className="p-2">
        <Button onClick={() => fixMutation.mutate()}>
          temporaneo, non cliccare se non c'è ale
        </Button>
      </SidebarMenu>
    </SidebarFooter>
  );
}
