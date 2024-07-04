import { createContext, useContext } from "react";
import { TypesOfOrder } from "../types/TypesOfOrder";

interface OrderContextProps {
  onOrdersUpdate: (type: TypesOfOrder) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({
  children,
  onOrdersUpdate,
}: {
  children: React.ReactNode;
  onOrdersUpdate: (type: TypesOfOrder) => void;
}) => {
  return (
    <OrderContext.Provider value={{ onOrdersUpdate }}>
      {children}
    </OrderContext.Provider>
  );
};
