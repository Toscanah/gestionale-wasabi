"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../../lib/api/fetchRequest";
import { AnyOrder } from "@/app/(site)/lib/shared";
import { Button } from "@/components/ui/button";
import { uniqueId } from "lodash";
import Section from "./Section";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import { Plus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import GoBack from "../../../components/ui/misc/GoBack";
import dynamic from "next/dynamic";
import { OrderStatus } from "@prisma/client";

const RandomSpinner = dynamic(() => import("../../../components/ui/misc/loader/RandomSpinner"), {
  ssr: false,
});

export default function OrdersStats() {
  const [orders, setOrders] = useState<AnyOrder[]>([]);
  const [sections, setSections] = useState<{ id: string }[]>([{ id: uniqueId() }]);
  const [isLoading, setIsLoading] = useState(true);

  const addSection = () => setSections((prev) => [...prev, { id: uniqueId() }]);

  const removeSection = (id: string) =>
    setSections((prev) => prev.filter((section) => section.id !== id));

  const clearSections = () =>
    sections.forEach((_, i) =>
      setTimeout(() => setSections((prev) => prev.filter((_, index) => index !== 0)), i * 500)
    );

  const fetchOrders = () =>
    fetchRequest<AnyOrder[]>("GET", "/api/payments/", "getOrdersWithPayments")
      .then((orders) => setOrders(orders.filter((order) => order.status !== OrderStatus.CANCELLED)))
      .finally(() => setIsLoading(false));

  useEffect(() => {
    fetchOrders();
  }, []);

  const onElementAppear = (el: any, index: number) =>
    spring({
      onUpdate: (val) => (el.style.opacity = val),
      delay: index * 50,
    });

  return isLoading ? (
    <div className="w-screen h-screen">
      <RandomSpinner isLoading={isLoading} />
    </div>
  ) : (
    <div className="flex flex-col w-screen h-screen gap-4 items-center">
      <h1 className="text-3xl mt-4">Statistiche ordini</h1>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <Button onClick={addSection}>
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi sezione
          </Button>

          {/* <Button
            onClick={() =>
              fetchRequest("PATCH", "/api/orders", "fixOrdersShift").then(() => location.reload())
            }
            variant="outline"
          >
            Aggiusta turni degli ordini
          </Button> */}
        </div>

        {/* <Button
          onClick={clearSections}
          variant={"link"}
          className={sections.length > 1 ? "block" : "invisible"}
        >
          Cancella tutte
        </Button> */}
      </div>

      <Flipper
        flipKey={sections.map((section) => section.id).join("")}
        spring={"stiff"}
        className="w-full flex flex-wrap gap-2 px-8 pt-6 pb-8 justify-center"
      >
        {sections.map((section, index) => {
          const isLast = index === sections.length - 1;
          const isOdd = index % 2 === 0;
          const shouldStretch = isLast && sections.length % 2 !== 0;

          return (
            <Flipped key={section.id} flipId={section.id} onAppear={onElementAppear}>
              <div
                className={cn("relative group select-none border p-6 rounded-lg shadow-md ")} // h-[45rem]
                style={{
                  flexBasis: shouldStretch ? "100%" : "calc(50% - 0.25rem)",
                  maxWidth: shouldStretch ? "100%" : "calc(50% - 0.25rem)",
                }}
              >
                <Section id={section.id} orders={orders} />
                <X
                  onClick={() => removeSection(section.id)}
                  size={32}
                  className="absolute top-[-1rem] right-[-1rem] invisible group-hover:visible hover:cursor-pointer 
                            hover:bg-opacity-50 hover:bg-muted-foreground/20 rounded-full p-1"
                />
              </div>
            </Flipped>
          );
        })}
      </Flipper>

      <GoBack path="/home" />
    </div>
  );
}
