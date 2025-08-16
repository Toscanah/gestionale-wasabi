import { createContext, useContext, useState, ReactNode } from "react";
import { AnyOrder } from "@/app/(site)/lib/shared";
import useRice, { UpdateRiceInput } from "../hooks/rice/useRice";
import useSettings from "../hooks/useSettings";
import { GlobalSettings } from "../lib/shared/types/Settings";
import { OrderType } from "@prisma/client";
import { Rice } from "../hooks/rice/useRiceState";
import { RFM, RFMRangeRule } from "../lib/shared/types/RFM";
import useRFM from "../hooks/useRFM";

export interface WasabiContextProps {
  updateGlobalState: (order: AnyOrder, action: "update" | "delete" | "add") => void;
  rice: Rice;
  updateRice: ({ delta, threshold, log, selectedRiceBatchId }: UpdateRiceInput) => void;
  resetRice: () => void;
  selectedOrders: SelectedOrders[];
  toggleOrderSelection: (order: SelectedOrders) => void;
  updateRemainingRice: (total?: number) => void;
  settings: GlobalSettings;
  updateSettings: (key: keyof GlobalSettings, value: any) => void;
  rfmRules: RFM;
  updateDimensionRule: (dimension: keyof RFM, index: number, updatedRule: RFMRangeRule) => void;
  updateDimensionRules: (dimension: keyof RFM, newRules: RFMRangeRule[]) => void;
  updateWeight: (dimension: keyof RFM, newWeight: number) => void;
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
  const { rfmRules, updateDimensionRule, resetRules, getRfmRules, updateDimensionRules, updateWeight } = useRFM();
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
        rfmRules,
        updateDimensionRule,
        updateDimensionRules,
        updateWeight,
      }}
    >
      {children}
    </WasabiContext.Provider>
  );
};
