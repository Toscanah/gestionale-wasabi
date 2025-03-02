import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from "react";
import { AnyOrder } from "@/app/(site)/models";
import { RecursivePartial, useOrderManager } from "../hooks/useOrderManager";
import { useProductManager } from "../hooks/useProductManager";
import { ProductInOrder } from "@/app/(site)/models";
import { Table } from "@tanstack/react-table";
import generateDummyProduct from "../functions/product-management/generateDummyProduct";

interface OrderProviderProps {
  order: AnyOrder;
  children: ReactNode;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

type OrderContextType = {
  setOrder: Dispatch<SetStateAction<AnyOrder>>;
  order: AnyOrder;
  dialogOpen: boolean;
  toggleDialog: (dialogOpen: boolean) => void;
  cancelOrder: (cooked: boolean) => Promise<void>;
  createSubOrder: (
    parentOrder: AnyOrder,
    products: ProductInOrder[],
    isReceiptPrinted: boolean
  ) => Promise<void>;
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
  joinTableOrders: (tableToJoin: string) => void;
  updateAddionalNote: (note: string, productInOrderId: number) => void;
};

export const OrderProvider = ({
  children,
  order: initialOrder,
  dialogOpen,
  setDialogOpen,
}: OrderProviderProps) => {
  const [order, setOrder] = useState<AnyOrder>({
    ...initialOrder,
    products: [
      ...(initialOrder.products ?? []).filter((p) => p.id !== -1),
      generateDummyProduct(),
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
  });

  const toggleDialog = (dialogOpen: boolean) => setDialogOpen(dialogOpen);

  const { updateOrder, cancelOrder, createSubOrder, joinTableOrders } = useOrderManager(
    order.id,
    setOrder,
    dialogOpen
  );
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
    updateAddionalNote,
  } = useProductManager(order, updateOrder);

  return (
    <OrderContext.Provider
      value={{
        order,
        joinTableOrders,
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
        updateAddionalNote,
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
