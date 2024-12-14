import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from "react";
import { AnyOrder } from "@/app/(site)/models";
import { RecursivePartial, useOrderManager } from "../components/hooks/useOrderManager";
import { useProductManager } from "../components/hooks/useProductManager";
import { ProductInOrder } from "@/app/(site)/models";
import { Table } from "@tanstack/react-table";
import createDummyProduct from "../util/functions/createDummyProduct";

interface OrderProviderProps {
  order: AnyOrder;
  children: ReactNode;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// il tipo di quello che torno alla gente
type OrderContextType = {
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
  order: AnyOrder;
  dialogOpen: boolean;
  toggleDialog: (dialogOpen: boolean) => void;
  cancelOrder: (cooked: boolean) => Promise<void>;
  createSubOrder: (parentOrder: AnyOrder, products: ProductInOrder[]) => Promise<void>;
  newCode: string;
  newQuantity: number;
  addProduct: () => void;
  addProducts: (products: ProductInOrder[]) => void;
  updateProduct: (key: string, value: any, index: number) => void;
  updateProductField: (key: string, value: any, index: number) => void;
  deleteProducts: (table: Table<any>, cooked: boolean) => void;
  updateProductOption: (productInOrderId: number, optionId: number) => void;
  updateUnprintedProducts: () => Promise<ProductInOrder[]>;
  updateOrder: (order: RecursivePartial<AnyOrder>) => void;
};

export const OrderProvider = ({
  children,
  order: initialOrder,
  dialogOpen,
  setDialogOpen,
}: OrderProviderProps) => {
  const [order, setOrder] = useState<AnyOrder>({
    ...initialOrder,
    products: [...(initialOrder.products ?? []).filter((p) => p.id !== -1), createDummyProduct()],
  });

  const toggleDialog = (dialogOpen: boolean) => setDialogOpen(dialogOpen);

  const { updateOrder, cancelOrder, createSubOrder } = useOrderManager(order, setOrder);
  const {
    addProduct,
    addProducts,
    newCode,
    newQuantity,
    updateProduct,
    updateProductField,
    deleteProducts,
    updateProductOption,
    updateUnprintedProducts,
  } = useProductManager(order, updateOrder);

  return (
    <OrderContext.Provider
      value={{
        order,
        setOrder,
        dialogOpen,
        toggleDialog,
        cancelOrder,
        createSubOrder,
        newCode,
        newQuantity,
        addProduct,
        addProducts,
        updateProduct,
        updateProductField,
        deleteProducts,
        updateProductOption,
        updateUnprintedProducts,
        updateOrder,
      }}
    >
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
