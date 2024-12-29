import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import fetchRequest from "../functions/api/fetchRequest";
import { Rice } from "@prisma/client";
import { toastSuccess } from "../functions/toast";
import { AnyOrder } from "@/app/(site)/models";
import { UpdateStateAction } from "../home/page";

type RiceState = { total: Rice; remaining: Rice };

interface WasabiContextProps {
  updateGlobalState: (order: AnyOrder, action: UpdateStateAction) => void;
  rice: RiceState;
  fetchRemainingRice: () => void;
  updateTotalRice: (total: Rice) => void;
  resetRice: () => void;
  selectedOrders: number[];
  toggleOrderSelection: (orderId: number) => void;
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
  const [rice, setRice] = useState<RiceState>({
    total: { id: 1, amount: -1, threshold: -1 },
    remaining: { id: 1, amount: -1, threshold: -1 },
  });

  const toggleOrderSelection = (orderId: number) =>
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );

  const fetchTotalRice = () =>
    fetchRequest<Rice>("GET", "/api/rice/", "getTotalRice").then((total) =>
      setRice((prevRice) => ({ ...prevRice, total }))
    );

  const fetchRemainingRice = () =>
    fetchRequest<Rice>("GET", "/api/rice", "getRemainingRice").then((remaining) =>
      setRice((prevRice) => ({ ...prevRice, remaining }))
    );

  const updateTotalRice = (total: Rice) =>
    fetchRequest("POST", "/api/rice/", "updateRice", { rice: total }).then(() => {
      setRice((prevRice) => ({
        ...prevRice,
        total: { ...total, amount: total.amount + prevRice.total.amount },
      }));
      fetchRemainingRice();
      toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
    });

  const basicRiceFetch = () => {
    fetchTotalRice();
    fetchRemainingRice();
  };

  const resetRice = () => fetchRequest("POST", "/api/rice/", "resetRice").then(basicRiceFetch);

  useEffect(basicRiceFetch, []);

  return (
    <WasabiContext.Provider
      value={{
        updateGlobalState,
        rice,
        fetchRemainingRice,
        updateTotalRice,
        resetRice,
        selectedOrders,
        toggleOrderSelection,
      }}
    >
      {children}
    </WasabiContext.Provider>
  );
};
