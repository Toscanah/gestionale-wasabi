import { createContext, useContext, useState, ReactNode } from "react";
import { AnyOrder } from "@/app/(site)/models";
import { UpdateStateAction } from "../home/page";
import useRice, { Rice } from "../hooks/useRice";
import useSettings from "../hooks/useSettings";
import { GlobalSettings } from "../types/Settings";

interface WasabiContextProps {
  updateGlobalState: (order: AnyOrder, action: UpdateStateAction) => void;
  rice: Rice;
  updateRice: (total: Rice) => void;
  resetRice: () => void;
  selectedOrders: number[];
  toggleOrderSelection: (orderId: number) => void;
  updateRemainingRice: (amount: number) => void;
  fetchRemainingRice: () => void;
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

export const WasabiProvider = ({ children, updateGlobalState }: WasabiProviderProps) => {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const { settings, updateSettings } = useSettings();
  const { rice, updateRice, updateRemainingRice, resetRice } = useRice();

  const toggleOrderSelection = (orderId: number) =>
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );

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
        fetchRemainingRice: updateRemainingRice,
        settings,
        updateSettings,
      }}
    >
      {children}
    </WasabiContext.Provider>
  );
};
