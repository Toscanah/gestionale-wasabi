"use client";

import { useEffect, useState } from "react";
import { LOCAL_EXTRA_ITEMS_KEY, LocalExtraItems } from "../hooks/useLocalExtraItems";
import { Button } from "@/components/ui/button";

type CounterType = "soupsMade" | "saladsMade";

type ItemConfig = {
  key: CounterType;
  label: string;
};

const ITEMS: ItemConfig[] = [
  { key: "soupsMade", label: "zuppe" },
  { key: "saladsMade", label: "insalate" },
];

export default function ExtraItemsDisplay() {
  const [remainingItems, setRemainingItems] = useState<{ [key in CounterType]: number }>({
    soupsMade: 0,
    saladsMade: 0,
  });

  const [isManualUpdate, setIsManualUpdate] = useState(false);

  const loadExtraItems = () => {
    if (isManualUpdate) return; // Prevent auto-update during manual edits

    const storedItems = localStorage.getItem(LOCAL_EXTRA_ITEMS_KEY);
    if (!storedItems) return;

    const { soupsMade, saladsMade, orders }: LocalExtraItems = JSON.parse(storedItems);

    const totalSoups = orders.reduce((sum, order) => sum + order.soups, 0);
    const totalSalads = orders.reduce((sum, order) => sum + order.salads, 0);

    setRemainingItems({
      soupsMade: totalSoups - soupsMade,
      saladsMade: totalSalads - saladsMade,
    });
  };

  const updateLocalStorage = (type: CounterType, amount: number) => {
    const storedItems = localStorage.getItem(LOCAL_EXTRA_ITEMS_KEY);
    if (!storedItems) return;

    let parsedItems: LocalExtraItems = JSON.parse(storedItems);
    const orderKey = type === "soupsMade" ? "soups" : "salads";
    const totalRequired = parsedItems.orders.reduce((sum, order) => sum + order[orderKey], 0);
    const newValue = parsedItems[type] + amount;

    if (newValue >= 0 && newValue <= totalRequired) {
      parsedItems[type] = newValue;
      localStorage.setItem(LOCAL_EXTRA_ITEMS_KEY, JSON.stringify(parsedItems));
      setIsManualUpdate(true);
      setTimeout(() => setIsManualUpdate(false), 3000);
      loadExtraItems();
    }
  };

  useEffect(() => {
    loadExtraItems();
    const interval = setInterval(loadExtraItems, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex justify-evenly items-center">
      {ITEMS.map(({ key, label }) => {
        const orderKey = key === "soupsMade" ? "soups" : "salads";
        return (
          <div key={key} className="space-y-2 flex flex-col items-center w-[35%]">
            <span className="text-3xl">Sono da fare</span>
            <div className="flex gap-4 items-center justify-center">
              <Button
                className="h-16 w-16"
                variant="outline"
                onClick={() => updateLocalStorage(key, 1)}
              >
                -1
              </Button>
              <span className="text-[10rem] w-52 flex justify-center">{remainingItems[key]}</span>
              <Button
                className="h-16 w-16"
                variant="outline"
                onClick={() => updateLocalStorage(key, -1)}
              >
                +1
              </Button>
            </div>
            <span className="text-3xl">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
