import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import fetchRequest from "../util/functions/fetchRequest";
import { Rice } from "@prisma/client";
import { toastSuccess } from "../util/toast";
import { AnyOrder } from "../types/PrismaOrders";

type RiceState = { total: Rice; remaining: Rice };

interface WasabiContextProps {
  updateGlobalState: (order: AnyOrder, action: "update" | "delete" | "add") => void;
  rice: RiceState;
  fetchRemainingRice: () => void;
  updateTotalRice: (total: Rice) => void;
  resetRice: () => void;
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
  const [rice, setRice] = useState<RiceState>({
    total: { id: 1, amount: -1, threshold: -1 },
    remaining: { id: 1, amount: -1, threshold: -1 },
  });

  const fetchTotalRice = () =>
    fetchRequest<Rice>("GET", "/api/rice/", "getTotalRice").then((total) =>
      setRice((prevRice) => ({ ...prevRice, total }))
    );

  const fetchRemainingRice = () =>
    fetchRequest<Rice>("GET", "/api/rice", "getRemainingRice").then((remaining) =>
      setRice((prevRice) => ({ ...prevRice, remaining }))
    );

  const updateTotalRice = (total: Rice) =>
    fetchRequest("POST", "/api/rice/", "updateRice", total).then(() => {
      setRice((prevRice) => ({
        ...prevRice,
        total: { ...total, amount: total.amount + prevRice.total.amount },
      }));
      fetchRemainingRice();
      toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
    });

  const resetRice = () =>
    fetchRequest("POST", "/api/rice/", "resetRice").then(() => {
      fetchTotalRice();
      fetchRemainingRice();
    });

  useEffect(() => {
    fetchTotalRice();
    fetchRemainingRice();
  }, []);

  return (
    <WasabiContext.Provider
      value={{
        updateGlobalState,
        rice,
        fetchRemainingRice,
        updateTotalRice,
        resetRice,
      }}
    >
      {children}
    </WasabiContext.Provider>
  );
};
