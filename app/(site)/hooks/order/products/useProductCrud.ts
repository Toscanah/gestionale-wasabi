import generateDummyProduct from "@/app/(site)/lib/services/product-management/generateDummyProduct";
import { OrderByType, ProductInOrder } from "@/app/(site)/lib/shared";
import { toastError } from "@/app/(site)/lib/utils/global/toast";
import { productsAPI } from "@/lib/server/api";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { UpdateProductsListFunction } from "../useProductsManager";

type UseProductCrudParams = {
  order: OrderByType;
  updateProductsList: UpdateProductsListFunction;
};

export default function useProductCrud({ order, updateProductsList }: UseProductCrudParams) {
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const resetInputs = () => {
    setNewCode("");
    setNewQuantity(0);
  };

  const addProductMutation = productsAPI.addToOrder.useMutation({
    onSuccess: (newProduct) => {
      updateProductsList({ addedProducts: [newProduct] });
      resetInputs();
    },
    onError: () => {
      updateProductsList({ updatedProducts: [generateDummyProduct()] });
      resetInputs();
      toastError(`Il prodotto con codice ${newCode} non è stato trovato`, "Prodotto non trovato");
    },
  });

  const addProduct = () =>
    addProductMutation.mutateAsync({
      order: { id: order.id, type: order.type },
      productCode: newCode,
      quantity: Number(newQuantity),
    });

  const addProductsMutation = productsAPI.addMultipleToOrder.useMutation({
    onSuccess: (newProducts) => {
      updateProductsList({ addedProducts: newProducts.addedProducts });
    },
  });

  const addProducts = (products: ProductInOrder[]) =>
    addProductsMutation.mutateAsync({
      orderId: order.id,
      products,
    });

  const updateProductMutation = productsAPI.updateInOrder.useMutation({
    onSuccess: ({ updatedProductInOrder: updatedProduct, isDeleted }) => {
      if (isDeleted) {
        return updateProductsList({ deletedProducts: [updatedProduct] });
      }

      updateProductsList({ updatedProducts: [updatedProduct] });
    },
    onError: () => {
      toastError(`Il prodotto con codice ${newCode} non è stato trovato`, "Prodotto non trovato");
      resetInputs();
    },
  });

  const updateProduct = (key: "quantity" | "code", value: any, index: number) => {
    let productToUpdate = order.products[index];

    if (key == "quantity" && value < 0) {
      return toastError("La quantità non può essere negativa");
    }

    updateProductMutation.mutateAsync({
      orderId: order.id,
      key,
      value,
      productInOrder: productToUpdate,
    });
  };

  const deletedProductsMutation = productsAPI.deleteFromOrder.useMutation({
    onSuccess: (deletedProducts) => {
      updateProductsList({ deletedProducts });
    },
  });

  const deleteProducts = (table: Table<ProductInOrder>, cooked: boolean) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedProductIds = selectedRows.map((row) => row.original.id);

    if (selectedProductIds.length > 0) {
      deletedProductsMutation.mutateAsync({
        productIds: selectedProductIds,
        orderId: order.id,
        cooked,
      });
      table.resetRowSelection();
    }
  };

  const updateProductField = (key: string, value: any, index: number) => {
    const updatedProducts = [...order.products];

    if (key === "code") {
      updatedProducts[index].product.code = value;
      setNewCode(value);
    } else if (key === "quantity") {
      updatedProducts[index].quantity = value;
      setNewQuantity(value);
    }

    updateProductsList({ updatedProducts, isDummyUpdate: true });
  };

  return {
    addProduct,
    addProducts,
    newCode,
    newQuantity,
    updateProduct,
    updateProductField,
    deleteProducts,
  };
}
