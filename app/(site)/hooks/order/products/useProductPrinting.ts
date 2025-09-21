import { AnyOrder, ProductInOrder } from "@/app/(site)/lib/shared";
import { UpdateProductsListFunction } from "../useProductsManager";
import { productsAPI } from "@/lib/server/api";

type UseProductPrintingParams = {
  order: AnyOrder;
  updateProductsList: UpdateProductsListFunction;
};

export default function useProductPrinting({
  order,
  updateProductsList,
}: UseProductPrintingParams) {
  const updatePrintedProductsMutation = productsAPI.updatePrinted.useMutation();

  const updatePrintedProducts = async () => {
    const unprintedProducts = await updatePrintedProductsMutation.mutateAsync({
      orderId: order.id,
    });

    if (unprintedProducts.length > 0) {
      const updatedProducts: ProductInOrder[] = unprintedProducts.map((unprintedProduct) => {
        const remainingQuantity = unprintedProduct.quantity - unprintedProduct.paid_quantity;
        return {
          ...unprintedProduct,
          quantity: remainingQuantity,
          to_be_printed: unprintedProduct.to_be_printed ?? 0,
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

  return { updatePrintedProducts };
}
