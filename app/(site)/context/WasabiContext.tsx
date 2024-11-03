import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { OrderType } from "@prisma/client";
import fetchRequest from "../util/functions/fetchRequest";
import { Rice } from "@prisma/client";
import { toastSuccess } from "../util/toast";

type RiceState = { total: Rice; remaining: Rice };

interface WasabiContextProps {
  rice: RiceState;
  updateTotalRice: (total: Rice) => void;
  fetchRemainingRice: () => void;
  onOrdersUpdate: (type: OrderType) => void;
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

export const WasabiProvider = ({
  children,
  onOrdersUpdate,
}: {
  children: ReactNode;
  onOrdersUpdate: (type: OrderType) => void;
}) => {
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
        resetRice,
        fetchRemainingRice,
        onOrdersUpdate,
        rice,
        updateTotalRice,
      }}
    >
      {children}
    </WasabiContext.Provider>
  );
};
