  import generateDummyProduct from "@/app/(site)/lib/services/product-management/generateDummyProduct";
  import { OrderByType, ProductInOrder } from "@/app/(site)/lib/shared";
  import { toastError } from "@/app/(site)/lib/utils/global/toast";
  import { productsAPI } from "@/lib/server/api";
  import { Table } from "@tanstack/react-table";
  import { UpdateProductsListFunction } from "../useProductsManager";
  import { useRef, useState } from "react";

  type UseProductCrudParams = {
    order: OrderByType;
    updateProductsList: UpdateProductsListFunction;
  };

  export default function useProductCrud({ order, updateProductsList }: UseProductCrudParams) {
    const [rows, setRows] = useState<Record<number, { code?: string; quantity?: number }>>({});

    const finalizeLockRef = useRef(new Set<number>()); // rowIndex locks
    const addLockRef = useRef(new Set<string>()); // order+code locks
    const cooldownRef = useRef(new Map<string, number>()); // key -> lastTs

    const COOLDOWN_MS = 150;

    const isCoolingDown = (key: string) => {
      const now = Date.now();
      const last = cooldownRef.current.get(key) ?? 0;
      if (now - last < COOLDOWN_MS) return true;
      cooldownRef.current.set(key, now);
      return false;
    };

    const setRowValue = (rowIndex: number, field: "code" | "quantity", value: string | number) => {
      setRows((prev) => ({
        ...prev,
        [rowIndex]: {
          ...prev[rowIndex],
          [field]: value,
        },
      }));
    };

    const getRowEdits = (rowIndex: number) => rows[rowIndex] ?? {};

    const clearRow = (rowIndex: number) => {
      setRows((prev) => {
        const clone = { ...prev };
        delete clone[rowIndex];
        return clone;
      });
    };

    const clearRows = () => {
      setRows({});
    };

    const addProductMutation = productsAPI.addToOrder.useMutation({
      onSuccess: (newProduct) => {
        updateProductsList({ addedProducts: [newProduct], onUpdate: clearRows });
      },
      onError: (_, vars) => {
        toastError(`Prodotto ${vars.productCode} non trovato`, "Prodotto non trovato");
        clearRows();
        updateProductsList({
          updatedProducts: [generateDummyProduct()],
          toast: false,
          onUpdate: clearRows,
        });
      },
    });

    const updateMutation = productsAPI.updateInOrder.useMutation({
      onSuccess: ({ updatedProductInOrder, isDeleted }) => {
        if (isDeleted) {
          return updateProductsList({
            deletedProducts: [updatedProductInOrder],
            onUpdate: clearRows,
          });
        }
        updateProductsList({ updatedProducts: [updatedProductInOrder], onUpdate: clearRows });
      },
      onError: () => {
        toastError(`Aggiornamento prodotto fallito`, "Prodotto non trovato");
        clearRows();
      },
    });

    const addProductToOrder = (code: string, quantity: number) => {
      return addProductMutation.mutateAsync({
        order: { id: order.id, type: order.type },
        productCode: code,
        quantity,
      });
    };

    const finalizeRowUpdate = async (rowIndex: number, quantity?: number) => {
      // 1) prevent concurrent finalize calls on same rowIndex
      if (finalizeLockRef.current.has(rowIndex)) return;
      finalizeLockRef.current.add(rowIndex);

      try {
        const row = order.products[rowIndex];
        if (!row) return;

        const pending = rows[rowIndex] ?? {};
        const code = (pending.code ?? row.product.code)?.toUpperCase();
        const finalQuantity = quantity ?? pending.quantity ?? row.quantity;

        const isDummy = row.product_id === -1;

        if (isDummy) {
          if (!code || finalQuantity === undefined || finalQuantity <= 0) return;

          const addKey = `${order.id}:${code}`;

          // 2) prevent double add for same code (spam enter / double submit)
          if (addLockRef.current.has(addKey)) return;

          // 3) optional cooldown to ignore ultra-fast repeats
          if (isCoolingDown(addKey)) return;

          addLockRef.current.add(addKey);
          try {
            await addProductToOrder(code, finalQuantity);
          } finally {
            addLockRef.current.delete(addKey);
          }

          clearRow(rowIndex);
          return;
        }

        const hasChanged = code !== row.product.code || finalQuantity !== row.quantity;
        if (!hasChanged) {
          clearRow(rowIndex);
          return;
        }

        const updKey = `${order.id}:${row.id}`;
        if (isCoolingDown(updKey)) return; // optional: prevents double-update spam

        await updateMutation.mutateAsync({
          orderId: order.id,
          updates: { code, quantity: finalQuantity },
          productInOrder: row,
        });

        clearRow(rowIndex);
      } finally {
        finalizeLockRef.current.delete(rowIndex);
      }
    };

    const addProductsMutation = productsAPI.addMultipleToOrder.useMutation({
      onSuccess: (newProducts) => {
        updateProductsList({ addedProducts: newProducts.addedProducts, onUpdate: clearRows });
      },
    });

    const addProducts = (products: ProductInOrder[]) =>
      addProductsMutation.mutateAsync({
        orderId: order.id,
        products,
      });

    const deleteProductsMutation = productsAPI.deleteFromOrder.useMutation({
      onSuccess: (deletedProducts) => {
        updateProductsList({ deletedProducts, onUpdate: clearRows });
      },
    });

    const deleteProducts = (table: Table<ProductInOrder>, cooked: boolean) => {
      const selected = table.getFilteredSelectedRowModel().rows;
      const ids = selected.map((r) => r.original.id);

      if (ids.length === 0) return;

      deleteProductsMutation.mutateAsync({
        productIds: ids,
        orderId: order.id,
        cooked,
      });

      table.resetRowSelection();
    };

    return {
      rows,
      setRowValue,
      getRowEdits,
      clearRow,
      finalizeRowUpdate,
      deleteProducts,
      addProducts,
    };
  }
