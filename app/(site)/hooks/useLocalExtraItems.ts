import { useEffect, useState } from "react";
import { useOrderContext } from "../context/OrderContext";
import calculateExtraItems from "@/app/(site)/lib/services/order-management/calculateExtraItems";

export type LocalExtraItems = {
  soupsMade: number;
  saladsMade: number;
  orders: { id: number; soups: number; salads: number }[];
};

export const DEFAULT_LOCAL_EXTRA_ITEMS: LocalExtraItems = {
  soupsMade: 0,
  saladsMade: 0,
  orders: [],
};

export const LOCAL_EXTRA_ITEMS_KEY = "localExtraItems";

export default function useLocalExtraItems() {
  const { order } = useOrderContext();
  const [localItems, setLocalItems] = useState<LocalExtraItems>(DEFAULT_LOCAL_EXTRA_ITEMS);

  const saveToLocalStorage = (updatedItems: LocalExtraItems) => {
    localStorage.setItem(LOCAL_EXTRA_ITEMS_KEY, JSON.stringify(updatedItems));
    setLocalItems(updatedItems);
  };

  const loadItems = () => {
    const storedItems = localStorage.getItem(LOCAL_EXTRA_ITEMS_KEY);
    setLocalItems(storedItems ? JSON.parse(storedItems) : DEFAULT_LOCAL_EXTRA_ITEMS);
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!order) return;

    const { soupsFinal, saladsFinal } = calculateExtraItems(order);
    
    let updatedLocalItems = { ...localItems };
    const existingOrderIndex = updatedLocalItems.orders.findIndex((o) => o.id === order.id);

    if (existingOrderIndex !== -1) {
      const existingOrder = updatedLocalItems.orders[existingOrderIndex];

      const soupsDiff = soupsFinal - existingOrder.soups;
      const saladsDiff = saladsFinal - existingOrder.salads;

      if (soupsDiff !== 0 || saladsDiff !== 0) {
        updatedLocalItems.orders[existingOrderIndex] = {
          ...existingOrder,
          soups: soupsFinal,
          salads: saladsFinal,
        };
      }
    } else {
      updatedLocalItems.orders = [
        ...updatedLocalItems.orders,
        { id: order.id, soups: soupsFinal, salads: saladsFinal },
      ];
    }

    saveToLocalStorage(updatedLocalItems);
  }, [order.products]);
}
