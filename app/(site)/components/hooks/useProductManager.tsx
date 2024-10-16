import { useState } from "react";
import { AnyOrder } from "../../types/PrismaOrders";
import createDummyProduct from "../../util/functions/createDummyProduct";
import { ProductInOrderType } from "../../types/ProductInOrderType";
import fetchRequest from "../../util/functions/fetchRequest";
import { toastError, toastSuccess } from "../../util/toast";
import { Table } from "@tanstack/react-table";
import { Option, OptionInProductOrder } from "@prisma/client";

export function useProductManager(
  order: AnyOrder,
  updateOrder: (updatedProducts: ProductInOrderType[]) => void
) {
  const [newCode, setNewCode] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [products, setProducts] = useState<ProductInOrderType[]>([
    ...order.products,
    createDummyProduct(),
  ]);

  const addProduct = () => {
    fetchRequest<ProductInOrderType>("POST", "/api/products/", "addProductToOrder", {
      order,
      productCode: newCode,
      quantity: newQuantity,
    }).then((newProduct) => {
      if (newProduct) {
        updateProductsList({ newProducts: [newProduct] });
      } else {
        toastError(`Il prodotto con codice ${newCode} non è stato trovato`, "Prodotto non trovato");
      }
    });
  };

  const addProducts = (products: ProductInOrderType[]) => {
    fetchRequest<ProductInOrderType[]>("POST", "/api/products", "addProductsToOrder", {
      orderId: order.id,
      products,
    }).then(() => updateProductsList({ newProducts: products }));
  };

  const updateProduct = (key: string, value: any, index: number) => {
    let productToUpdate = products[index];

    if (key == "quantity" && value < 0) {
      return toastError("La quantità non può essere negativa");
    }

    fetchRequest<{
      updatedProduct?: ProductInOrderType;
      deletedProduct?: ProductInOrderType;
      error?: string;
    }>("POST", "/api/products/", "updateProductInOrder", {
      orderId: order.id,
      key: key,
      value: value,
      product: productToUpdate,
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
      fetchRequest("DELETE", "/api/products/", "deleteProductFromOrder", {
        productIds: selectedProductIds,
        orderId: order.id,
        cooked,
      }).then(() => {
        updateProductsList({
          deletedProducts: products.filter((p) => selectedProductIds.includes(p.id)),
        });
        table.resetRowSelection();
      });
    }
  };

  const updateProductField = (key: string, value: any, index: number) => {
    const updatedProducts = [...products];

    if (key === "code") {
      updatedProducts[index].product.code = value;
      setNewCode(value);
    } else if (key === "quantity") {
      updatedProducts[index].quantity = value;
      setNewQuantity(value);
    }

    updateProductsList({ updatedProducts, isDummyUpdate: true });
  };

  const updateProductOption = (productInOrderId: number, optionId: number) => {
    fetchRequest<OptionInProductOrder & { option: Option }>(
      "POST",
      "/api/products/",
      "updateProductOptionsInOrder",
      { productInOrderId, optionId }
    ).then((newOption) => {
      const updatedProducts = products.map((product: ProductInOrderType) => {
        if (product.id !== productInOrderId) {
          return product;
        }

        const isOptionPresent = product.options.some(
          (selectedOption: { option: Option }) => selectedOption.option.id === newOption.option_id
        );

        return {
          ...product,
          options: isOptionPresent
            ? product.options.filter(
                (selectedOption: { option: Option }) =>
                  selectedOption.option.id !== newOption.option_id
              )
            : [...product.options, { option: newOption.option }],
        };
      });

      updateProductsList({ updatedProducts });
    });
  };

  const updateProductsList = ({
    newProducts = [],
    updatedProducts = [],
    deletedProducts = [],
    isDummyUpdate = false,
  }: {
    newProducts?: ProductInOrderType[];
    updatedProducts?: ProductInOrderType[];
    deletedProducts?: ProductInOrderType[];
    isDummyUpdate?: boolean;
  }) => {
    setProducts((prevProducts) => {
      if (isDummyUpdate) {
        return [...prevProducts];
      }

      const filteredProducts = prevProducts
        .filter((p) => !deletedProducts.some((deleted) => deleted.id === p.id))
        .filter((p) => p.id !== -1);
      const productsWithUpdates = filteredProducts.map((product) => {
        const update = updatedProducts.find((p) => p.id === product.id);
        return update ? { ...product, ...update } : product;
      });
      const updatedProductList = [...productsWithUpdates, ...newProducts, createDummyProduct()];

      updateOrder(updatedProductList);
      setNewCode("");
      setNewQuantity(0);
      toastSuccess("Prodotti aggiornati correttamente");
      return updatedProductList;
    });
  };

  return {
    products,
    setProducts,
    addProduct,
    addProducts,
    newCode,
    newQuantity,
    updateProduct,
    updateProductField,
    deleteProducts,
    updateProductOption,
  };
}
