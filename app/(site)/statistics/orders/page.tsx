"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import SelectWrapper from "../../components/select/SelectWrapper";
import { useEffect, useState } from "react";
import fetchRequest from "../../functions/api/fetchRequest";
import { AnyOrder } from "../../models";
import { Button } from "@/components/ui/button";
import { uniqueId } from "lodash";
import Section from "./Section";

export default function OrdersStats() {
  const [orders, setOrders] = useState<AnyOrder[]>([]);
  const [sections, setSections] = useState<{ id: string }[]>([{ id: uniqueId() }]);

  const addSection = () => setSections((prev) => [...prev, { id: uniqueId() }]); // Generate unique ID for each section

  const removeSection = (id: string) =>
    setSections((prev) => prev.filter((section) => section.id !== id));

  const fetchOrders = () =>
    fetchRequest<AnyOrder[]>("GET", "/api/payments/", "getOrdersWithPayments").then(setOrders);

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen gap-4 items-center">
      <Button onClick={addSection}>Aggiungi sezione</Button>

      {/* Render dynamic sections */}
      <div className="w-full flex gap-2 h-full  ">
        {sections.map((section, index) => (
          <Section key={section.id} id={section.id} orders={orders} removeSection={removeSection} />
        ))}
      </div>
    </div>
  );
}
