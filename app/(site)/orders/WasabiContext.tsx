import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  ReactNode,
} from "react";
import { TypesOfOrder } from "../types/TypesOfOrder";
import fetchRequest from "../util/fetchRequest";

interface WasabiContextProps {
  onOrdersUpdate: (type: TypesOfOrder) => void;
  rice: number;
  setRice: Dispatch<SetStateAction<number>>;
  fetchRice: () => void;
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
    fetchRequest<{ amount: number }>("GET", "/api/rice/?requestType=get").then(
      (riceData) => {
        setRice(riceData.amount);
      }
    );

  return (
    <WasabiContext.Provider
      value={{ onOrdersUpdate, rice, setRice, fetchRice }}
    >
      {children}
    </WasabiContext.Provider>
  );
};
