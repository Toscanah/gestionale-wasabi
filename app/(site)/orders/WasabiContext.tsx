import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { TypesOfOrder } from "../types/TypesOfOrder";
import fetchRequest from "../util/functions/fetchRequest";

interface WasabiContextProps {
  onOrdersUpdate: (type: TypesOfOrder) => void;
  rice: number;
  setRice: Dispatch<SetStateAction<number>>;
  fetchRice: () => void;
  updateRice: (amount: number) => void;
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
  onOrdersUpdate: (type: TypesOfOrder) => void;
}) => {
  const [rice, setRice] = useState<number>(0);

  const fetchRice = () =>
    fetchRequest<number>("GET", "/api/rice/", "getRice").then((amount) => {
      setRice(amount);
    });

  const updateRice = (amount: number) => {
    fetchRequest("POST", "/api/rice/", "updateRice", { rice: amount });
  };

  return (
    <WasabiContext.Provider value={{ onOrdersUpdate, rice, setRice, fetchRice, updateRice }}>
      {children}
    </WasabiContext.Provider>
  );
};
