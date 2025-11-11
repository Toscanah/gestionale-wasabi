"use client";

import { Button } from "@/components/ui/button";
import { SidebarFooter, SidebarMenu } from "@/components/ui/sidebar";
import WasabiDialog from "../ui/wasabi/WasabiDialog";
import { trpc } from "@/lib/server/client";
import { useEffect, useState } from "react";
import capitalizeFirstLetter from "../../lib/utils/global/string/capitalizeFirstLetter";
import { EmDash } from "../ui/misc/Placeholders";

{
  /* <Button disabled variant={"destructive"} onClick={() => fixMutation.mutate()}>
          no touchy
        </Button> */
}

// const fixMutation = trpc.orders.updateOrdersShift.useMutation();

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
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

  return (
    <SidebarFooter>
      <SidebarMenu className="flex-row flex justify-between text-sm text-muted-foreground">
        {capitalizeFirstLetter(formatDate(currentTime))}
        <EmDash />
        {formatTime(currentTime)}
      </SidebarMenu>
    </SidebarFooter>
  );
}
