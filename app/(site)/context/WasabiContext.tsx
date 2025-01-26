import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import fetchRequest from "../functions/api/fetchRequest";
import { toastSuccess } from "../functions/util/toast";
import { AnyOrder } from "@/app/(site)/models";
import { UpdateStateAction } from "../home/page";
import { GlobalSettings } from "../types/GlobalSettings";
import useRice, { Rice, RiceState } from "../hooks/useRice";

interface WasabiContextProps {
  updateGlobalState: (order: AnyOrder, action: UpdateStateAction) => void;
  rice: RiceState;
  updateTotalRice: (total: Rice) => void;
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
  const defaultSettings = {
    iva: "00000000000",
    kitchenOffset: 0,
    whenSelectorGap: 1,
  };

  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const { rice, updateTotalRice, updateRemainingRice, resetRice } = useRice();

  const getSettings = () => {
    const storedSettings = localStorage.getItem("settings");

    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setSettings(parsedSettings);
    } else {
      setSettings(defaultSettings);
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
    }
  };

  const updateSettings = (key: keyof GlobalSettings, value: any) => {
    let newValue = value;

    if (key === "kitchenOffset" && (value === null || isNaN(Number(value)))) {
      newValue = 0;
    }

    if (key === "whenSelectorGap" && (value === null || isNaN(Number(value)))) {
      newValue = 1;
    }

    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: newValue,
    }));

    localStorage.setItem("settings", JSON.stringify({ ...settings, [key]: newValue }));
  };

  const toggleOrderSelection = (orderId: number) =>
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );

  useEffect(() => getSettings(), []);

  return (
    <WasabiContext.Provider
      value={{
        updateGlobalState,
        rice,
        updateTotalRice,
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
