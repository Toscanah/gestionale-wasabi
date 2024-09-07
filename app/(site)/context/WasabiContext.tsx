import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { OrderType } from "../types/OrderType";
import fetchRequest from "../util/functions/fetchRequest";
import { Rice } from "@prisma/client";
import { toastSuccess } from "../util/toast";

type RiceState = { total: Rice; remaining: Rice };

interface WasabiContextProps {
  onOrdersUpdate: (type: OrderType) => void;
  rice: RiceState;
  updateTotalRice: (total: Rice) => void;
  fetchRemainingRice: () => void;
  
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
  const [rice, setRice] = useState<{ total: Rice; remaining: Rice }>({
    total: { id: 1, amount: -1, threshold: -1 },
    remaining: { id: 1, amount: -1, threshold: -1 },
  });

  const fetchTotalRice = () =>
    fetchRequest<Rice>("GET", "/api/rice/", "getTotalRice").then((total) => {
      setRice((prevRice) => ({ ...prevRice, total }));
    });

  const fetchRemainingRice = () =>
    fetchRequest<Rice>("GET", "/api/rice", "getRemainingRice").then((remaining) =>
      setRice((prevRice) => ({ ...prevRice, remaining }))
    );

  const updateTotalRice = (total: Rice) => {
    fetchRequest("POST", "/api/rice/", "updateRice", total).then(() => {
      setRice((prevRice) => ({ ...prevRice, total }));
      fetchRemainingRice();
      toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
    });
  };

  useEffect(() => {
    fetchTotalRice();
    fetchRemainingRice();
  }, []);

  return (
    <WasabiContext.Provider
      value={{
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
