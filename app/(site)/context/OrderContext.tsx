import { createContext, useContext, ReactNode, Dispatch, SetStateAction } from "react";
import { AnyOrder } from "../types/PrismaOrders";

type OrderContextType = {
  order: AnyOrder;
  setOrder?: Dispatch<SetStateAction<AnyOrder | undefined>>;
  dialogOpen: boolean;
  toggleDialog: (dialogOpen: boolean) => void;
};

interface OrderProviderProps {
  children: ReactNode;
  order: AnyOrder;
  setOrder?: Dispatch<SetStateAction<AnyOrder | undefined>>;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({
  children,
  order,
  setOrder,
  dialogOpen,
  setDialogOpen,
}: OrderProviderProps) => {
  const toggleDialog = (dialogOpen: boolean) => setDialogOpen(dialogOpen);

  return (
    <OrderContext.Provider value={{ order, setOrder, dialogOpen, toggleDialog }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
