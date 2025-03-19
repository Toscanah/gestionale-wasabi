"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../functions/api/fetchRequest";
import { AnyOrder } from "../../models";
import { Button } from "@/components/ui/button";
import { uniqueId } from "lodash";
import Section from "./Section";
import { Flipper, Flipped, spring } from "react-flip-toolkit";
import { Plus, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import GoBack from "../../components/ui/GoBack";

export default function OrdersStats() {
  const [orders, setOrders] = useState<AnyOrder[]>([]);
  const [sections, setSections] = useState<{ id: string }[]>([{ id: uniqueId() }]);

  const addSection = () => setSections((prev) => [...prev, { id: uniqueId() }]);

  const removeSection = (id: string) =>
    setSections((prev) => prev.filter((section) => section.id !== id));

  const clearSections = () =>
    sections.forEach((_, i) =>
      setTimeout(() => setSections((prev) => prev.filter((_, index) => index !== 0)), i * 500)
    );

  const fetchOrders = () =>
    fetchRequest<AnyOrder[]>("GET", "/api/payments/", "getOrdersWithPayments").then(setOrders);

  useEffect(() => {
    fetchOrders();
  }, []);

  const onElementAppear = (el: any, index: number) =>
    spring({
      onUpdate: (val) => (el.style.opacity = val),
      delay: index * 50,
    });

  return (
    <div className="flex flex-col w-screen h-screen gap-4 items-center">
      <h1 className="text-3xl mt-4">Statistiche ordini</h1>

      <div className="flex flex-col gap-4">
        <Button onClick={addSection}>
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi sezione
        </Button>

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
        className="w-screen flex gap-4 pt-4 px-8 pb-8 overflow-x-auto justify-start"
      >
        {sections.map((section) => (
          <Flipped key={section.id} flipId={section.id} onAppear={onElementAppear}>
            <div
              className={cn(
                "relative group select-none border p-4 rounded-lg shadow-md h-full",
                sections.length === 1 ? "w-full" : sections.length === 2 ? "w-1/2" : "w-1/3"
              )}
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
        ))}
      </Flipper>

      <GoBack path="/home" />
    </div>
  );
}
