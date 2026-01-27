"use client";

import { Button } from "@/components/ui/button";
import { SidebarFooter, SidebarMenu } from "@/components/ui/sidebar";
import WasabiDialog from "../shared/wasabi/WasabiDialog";
import { trpc } from "@/lib/trpc/client";
import { useEffect, useState } from "react";
import capitalizeFirstLetter from "@/lib/shared/utils/global/string/capitalizeFirstLetter";
import { EmDash } from "../shared/misc/Placeholders";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const fixMutation = trpc.orders.updateOrdersShift.useMutation();

  useEffect(() => {
    // Initialize clock only on the client
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // return (
  //   <Button variant={"destructive"} onClick={() => fixMutation.mutate()}>
  //     Refresh order shifts
  //   </Button>
  // );

  if (!currentTime)
    return (
      <SidebarFooter>
        <SidebarMenu className="flex-row flex justify-evenly text-sm text-muted-foreground">
          —
        </SidebarMenu>
      </SidebarFooter>
    );

  return (
    <SidebarFooter>
      <SidebarMenu className="flex-row flex justify-evenly text-sm text-muted-foreground">
        {capitalizeFirstLetter(formatDate(currentTime))}
        <EmDash />
        {formatTime(currentTime)}
      </SidebarMenu>
    </SidebarFooter>
  );
}
