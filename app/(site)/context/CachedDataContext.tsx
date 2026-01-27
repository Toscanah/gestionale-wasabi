import { createContext, useContext, ReactNode } from "react";
import { ComprehensiveCustomer, Product } from "@/lib/shared";
import { trpc } from "@/lib/trpc/client";
import { customersAPI, productsAPI } from "@/lib/trpc/api";

interface CachedDataContextType {
  products: Product[];
  customers: ComprehensiveCustomer[];
  setCustomers: (updater: (prev: ComprehensiveCustomer[]) => ComprehensiveCustomer[]) => void;
  isLoading: boolean;
}

const CachedDataContext = createContext<CachedDataContextType | undefined>(undefined);

export const useCachedDataContext = () => {
  const context = useContext(CachedDataContext);
  if (!context) throw new Error("useCachedDataContext must be used within a CachedDataProvider");
  return context;
};

interface CachedDataProviderProps {
  children: ReactNode;
}

export const CachedDataProvider = ({ children }: CachedDataProviderProps) => {
  const utils = trpc.useUtils();

  const { data: productsData, isLoading: isLoadingProducts } = productsAPI.getAll.useQuery();
  const { data: customersData, isLoading: isLoadingCustomers } =
    customersAPI.getAllComprehensive.useQuery(undefined, { enabled: false });

  // Single source of truth → directly edit tRPC query cache
  const setCustomers = (updater: (prev: ComprehensiveCustomer[]) => ComprehensiveCustomer[]) => {
    const prev = customersData?.customers || [];
    const updated = updater(prev);
    utils.customers.getAllComprehensive.setData(undefined, {
      customers: updated,
      totalCount: updated.length,
    });
  };

  return (
    <CachedDataContext.Provider
      value={{
        products: productsData?.products || [],
        customers: customersData?.customers || [],
        setCustomers,
        isLoading: isLoadingProducts || isLoadingCustomers,
      }}
    >
      {children}
    </CachedDataContext.Provider>
  );
};
