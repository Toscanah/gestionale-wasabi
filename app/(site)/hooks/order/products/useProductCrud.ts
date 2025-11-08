import generateDummyProduct from "@/app/(site)/lib/services/product-management/generateDummyProduct";
import {
  OrderByType,
  OrderGuards,
  ProductContracts,
  ProductInOrder,
} from "@/app/(site)/lib/shared";
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

  const addProductMutation = productsAPI.addToOrder.useMutation({
    onMutate: async (variables) => {
      const { productCode, quantity } = variables;
      const productInCache = cachedProducts.find(
        (p) => p.code?.toLowerCase() === productCode.toLowerCase()
      );

      if (!productInCache) {
        updateProductsList({ updatedProducts: [generateDummyProduct()] });
        toastError(
          `Il prodotto con codice ${productCode} non è stato trovato`,
          "Prodotto non trovato"
        );
        throw new Error("Invalid product code");
      }

      const optimisticProduct: ProductInOrder = {
        id: -Math.floor(Math.random() * 1_000_000), // negative int temp id
        order_id: order.id,
        product_id: productInCache.id,
        product: productInCache,
        quantity: Number(quantity),
        status: ProductInOrderStatus.IN_ORDER,
        created_at: new Date(),
        frozen_price: OrderGuards.isTable(order)
          ? productInCache.site_price
          : productInCache.home_price,
        options: [],
        last_printed_quantity: 0,
        paid_quantity: 0,
      };

      updateProductsList({ addedProducts: [optimisticProduct] });
      return { optimisticProduct };
    },

    onSuccess: (newProduct, _vars, ctx) => {
      if (ctx?.optimisticProduct) {
        updateProductsList({
          deletedProducts: [ctx.optimisticProduct],
          addedProducts: [newProduct],
        });
      } else {
        updateProductsList({ addedProducts: [newProduct] });
      }
      resetInputs();
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.optimisticProduct) {
        updateProductsList({ deletedProducts: [ctx.optimisticProduct] });
      }
      toastError(`Il prodotto con codice ${newCode} non è stato trovato`, "Prodotto non trovato");
      resetInputs();
    },
  });

  const addProduct = async () => {
    await addProductMutation.mutateAsync({
      order: { id: order.id, type: order.type },
      productCode: newCode,
      quantity: Number(newQuantity),
    });
  };

  const addProductsMutation = trpc.products.addMultipleToOrder.useMutation({
    onMutate: async (variables) => {
      const parsed = ProductContracts.AddMultipleToOrder.Input.parse(variables);

      const optimisticProducts: ProductInOrder[] = parsed.products.map((p) => ({
        ...p,
        id: -Math.floor(Math.random() * 1_000_000),
        created_at: new Date(),
        updated_at: new Date(),
        status: p.status ?? ProductInOrderStatus.IN_ORDER,
      }));

      updateProductsList({ addedProducts: optimisticProducts });
      return { optimisticProducts };
    },

    onSuccess: (data, _vars, ctx) => {
      if (ctx?.optimisticProducts?.length) {
        updateProductsList({
          deletedProducts: ctx.optimisticProducts,
          addedProducts: data.addedProducts,
        });
      } else {
        updateProductsList({ addedProducts: data.addedProducts });
      }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.optimisticProducts) {
        updateProductsList({ deletedProducts: ctx.optimisticProducts });
      }
    },
  });

  const addProducts = (products: ProductInOrder[]) =>
    addProductsMutation.mutateAsync({
      orderId: order.id,
      products,
    });

  const updateProductMutation = productsAPI.updateInOrder.useMutation({
    onMutate: async ({ key, value, productInOrder }) => {
      if (productInOrder.id < 0) {
        throw new Error("Optimistic products cannot be updated yet");
      }

      const parsed = ProductContracts.Common.InOrder.parse({
        ...productInOrder,
        [key]: value,
      });

      const previous = { ...parsed };
      const updated = { ...parsed, [key]: value };

      updateProductsList({ updatedProducts: [updated], isDummyUpdate: false });
      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        updateProductsList({ updatedProducts: [ctx.previous] });
      }
    },

    onSuccess: ({ updatedProductInOrder }) => {
      updateProductsList({ updatedProducts: [updatedProductInOrder] });
    },
  });

  const updateProduct = (key: "quantity" | "code", value: any, index: number) => {
    const productToUpdate = order.products[index];

    if (productToUpdate.id < 0) {
      return toastError("Attendi il salvataggio del prodotto prima di modificarlo.");
    }

    const coercedValue = key === "quantity" ? Number(value) : value;

    if (key === "quantity") {
      if (coercedValue < 0) {
        return toastError("La quantità non può essere negativa");
      }

      if (coercedValue === 0) {
        updateProductsList({ deletedProducts: [productToUpdate] });

        deleteProductsMutation.mutateAsync({
          productIds: [productToUpdate.id],
          orderId: order.id,
          cooked: false,
        });

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

  const deleteProductsMutation = productsAPI.deleteFromOrder.useMutation({
    onMutate: async (variables) => {
      const deletedProducts = order.products.filter((p) => variables.productIds.includes(p.id));
      updateProductsList({ deletedProducts });
      return { deletedProducts };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.deletedProducts) {
        updateProductsList({ addedProducts: ctx.deletedProducts });
      }
    },
  });

  const deleteProducts = (table: Table<ProductInOrder>, cooked: boolean) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedProductIds = selectedRows.map((row) => row.original.id);

    if (selectedProductIds.length > 0) {
      deleteProductsMutation.mutateAsync({
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
