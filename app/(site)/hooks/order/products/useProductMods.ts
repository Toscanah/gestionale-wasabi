import { AnyOrder } from "@/app/(site)/lib/shared";
import { productsAPI } from "@/lib/server/api";
import { UpdateProductsListFunction } from "../useProductsManager";

type UseProductModsParans = {
  order: AnyOrder;
  updateProductsList: UpdateProductsListFunction;
};

export default function useProductMods({ order, updateProductsList }: UseProductModsParans) {
  const updateProductOptionMutation = productsAPI.updateOptionInOrder.useMutation({
    onSuccess: ({ deleted, optionInProductOrder }) => {
      updateProductsList({
        updatedProducts: order.products.map((product) => {
          if (product.id !== optionInProductOrder.product_in_order_id) return product;

          return {
            ...product,
            options: deleted
              ? product.options.filter((o) => o.option.id !== optionInProductOrder.option.id)
              : [...product.options, optionInProductOrder],
          };
        }),
      });
    },
  });

  const updateProductOption = (productInOrderId: number, optionId: number) =>
    updateProductOptionMutation.mutateAsync({ productInOrderId, optionId });

  const updateProductVariationMutation = productsAPI.updateVariationInOrder.useMutation({
    onSuccess: (updatedProduct) => updateProductsList({ updatedProducts: [updatedProduct] }),
  });

  const updateProductVariation = (variation: string, productInOrderId: number) =>
    updateProductVariationMutation.mutateAsync({ variation, productInOrderId });

  return {
    updateProductOption,
    updateProductVariation,
  };
}
