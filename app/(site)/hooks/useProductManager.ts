import { useState } from "react";
import { AnyOrder, OptionInProductOrder } from "@shared";
import generateDummyProduct from "../lib/product-management/generateDummyProduct";
import { ProductInOrder } from "@shared";
import fetchRequest from "../lib/api/fetchRequest";
import { toastError, toastSuccess } from "../lib/util/toast";
import { Table } from "@tanstack/react-table";
import calculateOrderTotal from "../lib/order-management/calculateOrderTotal";
import { RecursivePartial } from "./useOrderManager";
import { getProductPrice } from "../lib/product-management/getProductPrice";
import { UpdateProductInOrderResponse } from "../sql/products/product-in-order/updateProductInOrder";

export function useProductManager(
  order: AnyOrder,
  updateOrder: (order: RecursivePartial<AnyOrder>) => void
) {
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const addProduct = () =>
    fetchRequest<ProductInOrder>("POST", "/api/products/", "addProductToOrder", {
      order,
      productCode: newCode,
      quantity: Number(newQuantity),
    }).then((newProduct) => {
      if (newProduct) {
        updateProductsList({ newProducts: [newProduct] });
      } else {
        updateProductsList({ updatedProducts: [generateDummyProduct()] });
        toastError(`Il prodotto con codice ${newCode} non è stato trovato`, "Prodotto non trovato");
      }
    });

  const addProducts = (products: ProductInOrder[]) =>
    fetchRequest<ProductInOrder[]>("POST", "/api/products", "addProductsToOrder", {
      targetOrderId: order.id,
      products,
    }).then((newProducts) => updateProductsList({ newProducts }));

  const updateProduct = (key: string, value: any, index: number) => {
    let productToUpdate = order.products[index];

    if (key == "quantity" && value < 0) {
      return toastError("La quantità non può essere negativa");
    }

    fetchRequest<UpdateProductInOrderResponse>("PATCH", "/api/products/", "updateProductInOrder", {
      orderId: order.id,
      key: key,
      value: value,
      productInOrder: productToUpdate,
    }).then((result) => {
      const { updatedProduct, deletedProduct, error } = result;

      if (error) {
        return toastError(
          `Il prodotto con codice ${newCode} non è stato trovato`,
          "Prodotto non trovato"
        );
      }

      updateProductsList({
        updatedProducts: updatedProduct && [updatedProduct],
        deletedProducts: deletedProduct && [deletedProduct],
      });
    });
  };

  const deleteProducts = (table: Table<any>, cooked: boolean) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedProductIds = selectedRows.map((row) => row.original.id);

    if (selectedProductIds.length > 0) {
      fetchRequest("DELETE", "/api/products/", "deleteProductsFromOrder", {
        productIds: selectedProductIds,
        orderId: order.id,
        cooked,
      }).then(() => {
        updateProductsList({
          deletedProducts: order.products.filter((p) => selectedProductIds.includes(p.id)),
        });
        table.resetRowSelection();
      });
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

  const updateProductOption = (productInOrderId: number, optionId: number) =>
    fetchRequest<OptionInProductOrder>("PATCH", "/api/products/", "updateProductOptionsInOrder", {
      productInOrderId,
      optionId,
    }).then((newOption) =>
      updateProductsList({
        updatedProducts: order.products.map((product) => {
          if (product.id !== productInOrderId) {
            return product;
          }

          const isOptionPresent = product.options.some(
            (selectedOption) => selectedOption.option.id === newOption.option_id
          );

          return {
            ...product,
            options: isOptionPresent
              ? product.options.filter(
                  (selectedOption) => selectedOption.option.id !== newOption.option_id
                )
              : [...product.options, { ...newOption }],
          };
        }),
      })
    );

  const updateUnprintedProducts = async () => {
    const unprintedProducts = await fetchRequest<ProductInOrder[]>(
      "PATCH",
      "/api/products/",
      "updatePrintedAmounts",
      {
        orderId: order.id,
      }
    );

    if (unprintedProducts.length > 0) {
      const updatedProducts = unprintedProducts.map((unprintedProduct) => {
        const remainingQuantity = unprintedProduct.quantity - unprintedProduct.paid_quantity;

        return {
          ...unprintedProduct,
          quantity: remainingQuantity,
          total: remainingQuantity * getProductPrice(unprintedProduct, order.type),
          rice_quantity: remainingQuantity * unprintedProduct.product.rice,
          printed_amount: unprintedProduct.quantity,
        };
      });

      updateProductsList({
        updatedProducts,
        toast: false,
        updateFlag: false,
      });
    }

    return unprintedProducts;
  };

  const updateAddionalNote = (note: string, productInOrderId: number) =>
    fetchRequest<ProductInOrder>("PATCH", "/api/products/", "updateAdditionalNote", {
      note,
      productInOrderId,
    }).then((updatedProduct) => {
      if (updatedProduct) {
        updateProductsList({ updatedProducts: [updatedProduct] });
      }
    });

  const updateProductsList = ({
    newProducts = [],
    updatedProducts = [],
    deletedProducts = [],
    isDummyUpdate = false,
    toast = true,
    updateFlag = true,
  }: {
    newProducts?: ProductInOrder[];
    updatedProducts?: ProductInOrder[];
    deletedProducts?: ProductInOrder[];
    isDummyUpdate?: boolean;
    toast?: boolean;
    updateFlag?: boolean;
  }) => {
    if (isDummyUpdate) return;

    const updatedProductsList = order.products
      .filter(
        (product) =>
          !deletedProducts.some((deleted) => deleted.id === product.id) &&
          !["DELETED_COOKED", "DELETED_UNCOOKED"].includes(product.state)
      ).filter((product) => product.id !== -1)
      .map((product) => {
        const update = updatedProducts.find((p) => p.id === product.id);
        return update ? { ...product, ...update } : product;
      });

    const finalProducts = [...updatedProductsList, ...newProducts, generateDummyProduct()];

    const total = calculateOrderTotal({
      ...order,
      products: finalProducts,
    });

    updateOrder({
      products: finalProducts,
      total,
      is_receipt_printed: updateFlag ? false : undefined,
    });

    setNewCode("");
    setNewQuantity(0);

    if (toast) toastSuccess("Prodotti aggiornati correttamente");
  };

  return {
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
  };
}
