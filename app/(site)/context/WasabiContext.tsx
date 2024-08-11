import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { OrderType } from "../types/OrderType";
import fetchRequest from "../util/functions/fetchRequest";
import { Rice } from "@prisma/client";
import { toastSuccess } from "../util/toast";

interface WasabiContextProps {
  onOrdersUpdate: (type: OrderType) => void;
  rice: Rice;
  setRice: Dispatch<SetStateAction<Rice>>;
  fetchRice: () => void;
  updateRice: (rice: Rice) => void;
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
  const [rice, setRice] = useState<Rice>({
    id: 1,
    amount: 0,
    threshold: 0,
  });

  const fetchRice = () =>
    fetchRequest<Rice>("GET", "/api/rice/", "getRice").then((rice) => setRice(rice));

  const updateRice = (rice: Rice) => {
    fetchRequest("POST", "/api/rice/", "updateRice", { rice }).then(() => {
      toastSuccess("Riso aggiornato correttamente", "Riso aggiornato");
    });
  };

  return (
    <WasabiContext.Provider value={{ onOrdersUpdate, rice, setRice, fetchRice, updateRice }}>
      {children}
    </WasabiContext.Provider>
  );
};
