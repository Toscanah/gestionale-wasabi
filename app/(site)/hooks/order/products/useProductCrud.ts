import generateDummyProduct from "@/app/(site)/lib/services/product-management/generateDummyProduct";
import { OrderByType, ProductContracts, ProductInOrder } from "@/app/(site)/lib/shared";
import { toastError } from "@/app/(site)/lib/utils/global/toast";
import { productsAPI } from "@/lib/server/api";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { UpdateProductsListFunction } from "../useProductsManager";
import { useCachedDataContext } from "@/app/(site)/context/CachedDataContext";
import { ProductInOrderStatus } from "@prisma/client";
import { trpc } from "@/lib/server/client";

type UseProductCrudParams = {
  order: OrderByType;
  updateProductsList: UpdateProductsListFunction;
};

export default function useProductCrud({ order, updateProductsList }: UseProductCrudParams) {
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const { products: cachedProducts } = useCachedDataContext();

  const resetInputs = () => {
    setNewCode("");
    setNewQuantity(0);
  };

  // ----------------------------------------------------------
  // ADD PRODUCT (NO OPTIMISTIC UPDATE)
  // ----------------------------------------------------------
  const addProductMutation = productsAPI.addToOrder.useMutation({
    onSuccess: (newProduct) => {
      updateProductsList({ addedProducts: [newProduct] });
      resetInputs();
    },
    onError: () => {
      toastError(`Il prodotto ${newCode} non è stato trovato`, "Errore");
      resetInputs();
    },
  });

  const addProduct = async () => {
    const productInCache = cachedProducts.find(
      (p) => p.code?.toLowerCase() === newCode.toLowerCase()
    );

    if (!productInCache) {
      toastError(`Il prodotto ${newCode} non è stato trovato`, "Errore");
      return resetInputs();
    }

    await addProductMutation.mutateAsync({
      order: { id: order.id, type: order.type },
      productCode: newCode,
      quantity: Number(newQuantity),
    });
  };

  // ----------------------------------------------------------
  // ADD MULTIPLE PRODUCTS (NO OPTIMISTIC UPDATE)
  // ----------------------------------------------------------
  const addProductsMutation = trpc.products.addMultipleToOrder.useMutation({
    onSuccess: (data) => {
      updateProductsList({ addedProducts: data.addedProducts });
    },
    onError: () => {
      toastError("Errore nell'aggiungere i prodotti.", "Errore");
    },
  });

  const addProducts = (products: ProductInOrder[]) =>
    addProductsMutation.mutateAsync({
      orderId: order.id,
      products,
    });

  // ----------------------------------------------------------
  // UPDATE PRODUCT (NO OPTIMISTIC UPDATE)
  // ----------------------------------------------------------
  const updateProductMutation = productsAPI.updateInOrder.useMutation({
    onSuccess: ({ updatedProductInOrder }) => {
      updateProductsList({ updatedProducts: [updatedProductInOrder] });
    },
    onError: () => {
      toastError("Errore nell'aggiornare il prodotto", "Errore");
    },
  });

  const updateProduct = (key: "quantity" | "code", value: any, index: number) => {
    const productToUpdate = order.products[index];

    const coercedValue = key === "quantity" ? Number(value) : value;

    if (key === "quantity") {
      if (coercedValue < 0) {
        return toastError("La quantità non può essere negativa");
      }

      if (coercedValue === 0) {
        // delete
        deleteProducts([productToUpdate.id], false);
        return;
      }
    }

    updateProductMutation.mutateAsync({
      orderId: order.id,
      key,
      value: coercedValue,
      productInOrder: productToUpdate,
    });
  };

  // ----------------------------------------------------------
  // DELETE PRODUCT (NO OPTIMISM)
  // ----------------------------------------------------------
  const deleteProductsMutation = productsAPI.deleteFromOrder.useMutation({
    onSuccess: (_, vars) => {
      updateProductsList({
        deletedProducts: order.products.filter((p) => vars.productIds.includes(p.id)),
      });
    },
    onError: () => {
      toastError("Errore nell'eliminare i prodotti", "Errore");
    },
  });

  const deleteProducts = (productIds: number[], cooked: boolean) => {
    deleteProductsMutation.mutateAsync({
      productIds,
      orderId: order.id,
      cooked,
    });
  };

  const deleteProductsFromTable = (table: Table<ProductInOrder>, cooked: boolean) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedProductIds = selectedRows.map((row) => row.original.id);

    if (selectedProductIds.length > 0) {
      deleteProducts(selectedProductIds, cooked);
      table.resetRowSelection();
    }
  };

  // ----------------------------------------------------------
  // LOCAL INPUT ON CHANGE (NO OPTIMISM)
  // ----------------------------------------------------------
  const updateProductField = (key: string, value: any, index: number) => {
    if (key === "code") setNewCode(value);
    else if (key === "quantity") setNewQuantity(value);
  };

  return {
    addProduct,
    addProducts,
    newCode,
    newQuantity,
    updateProduct,
    updateProductField,
    deleteProducts: deleteProductsFromTable,
  };
}
