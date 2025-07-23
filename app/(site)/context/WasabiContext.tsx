import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AnyOrder } from "@/app/(site)/lib/shared";
import useRice, { Rice, UpdateRiceInput } from "../hooks/useRice";
import useSettings from "../hooks/useSettings";
import { GlobalSettings } from "../lib/shared/types/Settings";
import { OrderType } from "@prisma/client";

interface WasabiContextProps {
  updateGlobalState: (order: AnyOrder, action: "update" | "delete" | "add") => void;
  rice: Rice;
  updateRice: ({ delta, threshold }: UpdateRiceInput) => void;
  resetRice: () => void;
  selectedOrders: SelectedOrders[];
  toggleOrderSelection: (order: SelectedOrders) => void;
  updateRemainingRice: (total?: number) => void;
  settings: GlobalSettings;
  updateSettings: (key: keyof GlobalSettings, value: any) => void;
}

const WasabiContext = createContext<WasabiContextProps | undefined>(undefined);

export const useWasabiContext = () => {
  const context = useContext(WasabiContext);
  if (!context) {
    throw new Error("useWasabiContext must be used within a WasabiProvider");
  }
  return context;
};

interface WasabiProviderProps {
  children: ReactNode;
  updateGlobalState: (order: AnyOrder, action: "update" | "delete" | "add") => void;
}

type SelectedOrders = { id: number; type: OrderType };

export const WasabiProvider = ({ children, updateGlobalState }: WasabiProviderProps) => {
  const [selectedOrders, setSelectedOrders] = useState<SelectedOrders[]>([]);
  const { settings, updateSettings } = useSettings();
  const { rice, updateRice, updateRemainingRice, resetRice } = useRice();

  const toggleOrderSelection = (order: SelectedOrders) =>
    setSelectedOrders((prevSelected) => {
      const isSelected = prevSelected.some((o) => o.id === order.id);
      return isSelected ? prevSelected.filter((o) => o.id !== order.id) : [...prevSelected, order];
    });

  return (
    <WasabiContext.Provider
      value={{
        updateGlobalState,
        rice,
        updateRice,
        updateRemainingRice,
        resetRice,
        selectedOrders,
        toggleOrderSelection,
        settings,
        updateSettings,
      }}
    >
      {children}
    </WasabiContext.Provider>
  );
};
