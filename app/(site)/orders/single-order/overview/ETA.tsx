"use client";

import { useEffect, useState } from "react";
import { OrderType } from "@prisma/client";
import { AnyOrder, HomeOrder } from "@shared";
import { useOrderContext } from "@/app/(site)/context/OrderContext";
import { useWasabiContext } from "@/app/(site)/context/WasabiContext";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import calculateETA from "@/app/(site)/lib/order-management/calculateETA";

export default function ETA() {
  return <></>
  const { order } = useOrderContext();
  const { settings } = useWasabiContext();
  const [etaText, setEtaText] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndCalculateETA = async () => {
      if (!order || !settings.riders) return;

      const homeOrders = await fetchRequest<HomeOrder[]>("GET", "/api/orders/", "getOrdersByType", {
        type: OrderType.HOME,
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = homeOrders.filter((o) => new Date(o.created_at) >= today);

      const result = calculateETA({
        order: order as HomeOrder,
        homeOrders: todayOrders,
        riders: settings.riders,
      });

      const format = (date: Date) =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const arrivalFrom = new Date(result.estimatedArrival.getTime() - 10 * 60 * 1000);
      const arrivalTo = new Date(result.estimatedArrival.getTime() + 10 * 60 * 1000);

      setEtaText(`ETA: ${format(arrivalFrom)} – ${format(arrivalTo)}`);
    };

    fetchAndCalculateETA();
  }, [order, settings.riders]);

  if (!etaText) return null;

  return <p className="h-12 rounded-lg border w-full flex justify-center text-2xl items-center">{etaText}</p>;
}
