import filterDeletedProducts from "@/app/(site)/lib/services/product-management/filterDeletedProducts";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import { useState } from "react";

export default function useRecreateOrder() {
  const [selectedProducts, setSelectedProducts] = useState<ProductInOrder[]>([]);

  const updateProductSelection = (product: ProductInOrder) =>
    setSelectedProducts((prevSelected) =>
      prevSelected.some((p) => p.id === product.id)
        ? prevSelected.filter((p) => p.id !== product.id)
        : [...prevSelected, product]
    );

  const resetProductSelection = () => setSelectedProducts([]);

  const getRecreatedProducts = () => filterDeletedProducts(selectedProducts);

  return {
    selectedProducts,
    updateProductSelection,
    getRecreatedProducts,
    resetProductSelection,
  };
}
