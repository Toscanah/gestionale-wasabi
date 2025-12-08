import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from "react";
import { OrderByType } from "@/app/(site)/lib/shared";
import { useProductsManager } from "../hooks/order/useProductsManager";
import generateDummyProduct from "../lib/services/product-management/generateDummyProduct";
import { useOrderManager } from "../hooks/order/useOrderManager";

type OrderProviderProps = {
  order: OrderByType;
  children: ReactNode;
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

type ProductManager = ReturnType<typeof useProductsManager>;

type OrderManager = ReturnType<typeof useOrderManager>;

type OrderContextType = ProductManager &
  OrderManager & {
    setOrder: Dispatch<SetStateAction<OrderByType>>;
    order: OrderByType;
    dialogOpen: boolean;
    toggleDialog: (dialogOpen: boolean) => void;
  };

const OrderContext = createContext<OrderContextType | undefined>(undefined);

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
    updateOrderDiscount,
    applyPromotionToOrder,
    removePromotionFromOrder,
    rebalanceOrderPromotions,
  } = useOrderManager(order, setOrder, dialogOpen);

  const {
    rows,
    clearRow,
    finalizeRowUpdate,
    getRowEdits,
    setRowValue,
    deleteProducts,
    updateProductOption,
    updatePrintedProducts,
    updateProductVariation,
  } = useProductsManager(order, updateOrder, rebalanceOrderPromotions);

  return (
    <OrderContext.Provider
      value={{
        dialogOpen,
        order,
        setOrder,
        toggleDialog,
        clearRow,
        finalizeRowUpdate,
        getRowEdits,
        rows,
        setRowValue,
        deleteProducts,
        updateProductOption,
        updatePrintedProducts,
        updateProductVariation,
        updateOrder,
        updatePrintedFlag,
        cancelOrder,
        createSubOrder,
        joinTableOrders,
        issueLedgers,
        updateOrderDiscount,
        applyPromotionToOrder,
        removePromotionFromOrder,
        rebalanceOrderPromotions,
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
