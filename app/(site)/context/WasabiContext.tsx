import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import fetchRequest from "../functions/api/fetchRequest";
import { Rice } from "@prisma/client";
import { toastSuccess } from "../functions/util/toast";
import { AnyOrder } from "@/app/(site)/models";
import { UpdateStateAction } from "../home/page";

type RiceState = { total: Rice; remaining: Rice };

interface WasabiContextProps {
  updateGlobalState: (order: AnyOrder, action: UpdateStateAction) => void;
  rice: RiceState;
  updateTotalRice: (total: Rice) => void;
  resetRice: () => void;
  selectedOrders: number[];
  toggleOrderSelection: (orderId: number) => void;
  updateRemainingRice: (amount: number) => void;
  fetchRemainingRice: () => void
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

  const updateTotalRice = (total: Rice) =>
    fetchRequest("POST", "/api/rice/", "updateRice", { rice: total }).then(() => {
      setRice((prevRice) => ({
        ...prevRice,
        total: { ...total, amount: total.amount + prevRice.total.amount },
      }));
      toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
    });

  const updateRemainingRice = (amount: number) =>
    setRice((prevRice) => ({
      ...prevRice,
      remaining: {
        ...prevRice.remaining,
        amount: prevRice.remaining.amount - amount,
      },
    }));

  const fetchInitialRice = async () => {
    const [totalRice, remainingRice] = await Promise.all([
      fetchRequest<Rice>("GET", "/api/rice/", "getTotalRice"),
      fetchRequest<Rice>("GET", "/api/rice", "getRemainingRice"),
    ]);

    setRice({
      total: totalRice,
      remaining: remainingRice,
    });
  };

  const fetchRemainingRice = () =>
    fetchRequest<Rice>("GET", "/api/rice", "getRemainingRice").then((remaining) =>
      setRice((prevRice) => ({ ...prevRice, remaining }))
    );

  const resetRice = () => fetchRequest("POST", "/api/rice/", "resetRice").then(fetchInitialRice);

  useEffect(() => {
    fetchInitialRice();
  }, []);

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
        fetchRemainingRice,
      }}
    >
      {children}
    </WasabiContext.Provider>
  );
};
