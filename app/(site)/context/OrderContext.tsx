import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from "react";
import { OrderByType, OrderContracts } from "@/app/(site)/lib/shared";
import { useProductsManager } from "../hooks/order/useProductsManager";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { Table } from "@tanstack/react-table";
import generateDummyProduct from "../lib/services/product-management/generateDummyProduct";
import { RecursivePartial, useOrderManager } from "../hooks/order/useOrderManager";

interface OrderProviderProps {
  order: OrderByType;
  children: ReactNode;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderContextType {
  setOrder: Dispatch<SetStateAction<OrderByType>>;
  order: OrderByType;
  dialogOpen: boolean;
  toggleDialog: (dialogOpen: boolean) => void;
  cancelOrder: (cooked: boolean) => Promise<void>;
  createSubOrder: (
    parentOrder: OrderByType,
    products: ProductInOrder[],
    isReceiptPrinted: boolean
  ) => Promise<void>;
  newCode: string;
  newQuantity: number;
  addProduct: () => void;
  addProducts: (products: ProductInOrder[]) => void;
  updateProduct: (key: "quantity" | "code", value: any, index: number) => void;
  updateProductField: (key: string, value: any, index: number) => void;
  deleteProducts: (table: Table<any>, cooked: boolean) => void;
  updateProductOption: (productInOrderId: number, optionId: number) => void;
  updatePrintedProducts: () => Promise<ProductInOrder[]>;
  updateOrder: (order: RecursivePartial<OrderByType> ) => void;
  updatePrintedFlag: () => Promise<OrderContracts.UpdatePrintedFlag.Output>;
  joinTableOrders: (tableToJoin: string) => void;
  updateProductVariation: (variation: string, productInOrderId: number) => void;
  issueLedgers: (order: OrderByType) => Promise<void>;
}

export const OrderProvider = ({
  children,
  order: initialOrder,
  dialogOpen,
  setDialogOpen,
}: OrderProviderProps) => {
  const [order, setOrder] = useState<OrderByType>({
    ...initialOrder,
    products: [
      ...(initialOrder.products ?? []).filter((p) => p.id !== -1),
      generateDummyProduct(),
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
  });

  const toggleDialog = (dialogOpen: boolean) => setDialogOpen(dialogOpen);

  const {
    updateOrder,
    updatePrintedFlag,
    cancelOrder,
    createSubOrder,
    joinTableOrders,
    issueLedgers,
  } = useOrderManager(order.id, setOrder, dialogOpen);

  const {
    addProduct,
    addProducts,
    newCode,
    newQuantity,
    updateProduct,
    updateProductField,
    deleteProducts,
    updateProductOption,
    updatePrintedProducts,
    updateProductVariation,
  } = useProductsManager(order, updateOrder);

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
        updatePrintedProducts,
        updateOrder,
        updatePrintedFlag,
        updateProductVariation,
        issueLedgers,
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
